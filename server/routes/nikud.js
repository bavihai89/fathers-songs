import { Router } from 'express';

const router = Router();

router.post('/', async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'נדרש טקסט' });

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return res.status(503).json({ error: 'נדרש ANTHROPIC_API_KEY ב-.env לשירות הניקוד' });
  }

  try {
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: `הוסף ניקוד מדויק לשיר העברי הבא. שמור על אותו מבנה שורות ורווחים בדיוק. החזר רק את הטקסט המנוקד ללא הסברים נוספים.\n\n${text}`,
        }],
        system: 'אתה מומחה בדקדוק עברי ובשירה. הוסף ניקוד מדויק לכל מילה תוך התחשבות בהקשר השירי. שמור על מבנה השורות המקורי בדיוק.',
      }),
    });

    if (!claudeRes.ok) {
      const err = await claudeRes.text();
      throw new Error(`Claude API: ${err}`);
    }

    const data = await claudeRes.json();
    const nikudText = data.content?.[0]?.text?.trim() || '';
    res.json({ nikud: nikudText });
  } catch (e) {
    res.status(500).json({ error: 'שגיאה בשירות הניקוד: ' + e.message });
  }
});

export default router;
