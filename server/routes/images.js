import { Router } from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = join(__dirname, '../../public/images');

if (!existsSync(IMAGES_DIR)) mkdirSync(IMAGES_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: IMAGES_DIR,
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `img-${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'לא נבחר קובץ' });
  res.json({ path: `/images/${req.file.filename}` });
});

router.post('/generate', async (req, res) => {
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: 'נדרש תיאור' });

  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!openaiKey) return res.status(500).json({ error: 'מפתח OPENAI_API_KEY לא מוגדר ב-.env' });

  try {
    // Translate Hebrew to English using Claude
    let englishPrompt = description;
    if (anthropicKey) {
      const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5',
          max_tokens: 200,
          messages: [{
            role: 'user',
            content: `Translate this Hebrew text to English for an AI image generator. Return only the English translation: "${description}"`,
          }],
        }),
      });
      const claudeData = await claudeRes.json();
      if (claudeData.content?.[0]?.text) englishPrompt = claudeData.content[0].text.trim();
    }

    const finalPrompt = `${englishPrompt}. Style: painterly illustration for a Hebrew poetry book, warm oil painting, golden and sepia tones, soft poetic atmosphere, emotional depth, no text in image.`;

    const dalleRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'chatgpt-image-latest',
        prompt: finalPrompt,
        n: 1,
        size: '1024x1024',
      }),
    });

    const dalleData = await dalleRes.json();
    if (dalleData.error) throw new Error(dalleData.error.message);

    const b64 = dalleData.data?.[0]?.b64_json;
    const imageUrl = dalleData.data?.[0]?.url;
    if (!b64 && !imageUrl) throw new Error('לא התקבלה תמונה מ-DALL-E');

    let buffer;
    if (b64) {
      buffer = Buffer.from(b64, 'base64');
    } else {
      const imgRes = await fetch(imageUrl);
      buffer = Buffer.from(await imgRes.arrayBuffer());
    }
    const filename = `ai-${Date.now()}.png`;
    const { writeFile } = await import('fs/promises');
    await writeFile(join(IMAGES_DIR, filename), buffer);

    res.json({ path: `/images/${filename}` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
