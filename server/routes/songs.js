import { Router } from 'express';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import multer from 'multer';
import mammoth from 'mammoth';
import { DATA_DIR } from '../init.js';

const upload = multer({ storage: multer.memoryStorage() });
const DATA_PATH = join(DATA_DIR, 'songs.json');

async function readSongs() {
  const raw = await readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

async function writeSongs(songs) {
  await writeFile(DATA_PATH, JSON.stringify(songs, null, 2), 'utf-8');
}

const router = Router();

router.get('/', async (req, res) => {
  try {
    const songs = await readSongs();
    res.json(songs.sort((a, b) => a.order - b.order));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const songs = await readSongs();
    const maxId = songs.reduce((m, s) => Math.max(m, s.id), 0);
    const maxOrder = songs.reduce((m, s) => Math.max(m, s.order), 0);
    const newSong = {
      id: maxId + 1,
      title: req.body.title || 'שיר חדש',
      dedication: req.body.dedication || '',
      lyrics: req.body.lyrics || '',
      status: req.body.status || 'draft',
      image: req.body.image || null,
      order: maxOrder + 1,
      notes: req.body.notes || '',
      updatedAt: new Date().toISOString().split('T')[0],
    };
    songs.push(newSong);
    await writeSongs(songs);
    res.status(201).json(newSong);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Import from .docx file
router.post('/import/docx', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'לא נשלח קובץ' });
    const result = await mammoth.extractRawText({ buffer: req.file.buffer });
    const text = result.value.trim();
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const title = lines[0] || 'שיר מיובא';
    const lyrics = lines.slice(1).join('\n').trim();
    res.json({ title, lyrics, text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Import from plain text (paste)
router.post('/import/text', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'לא נשלח טקסט' });
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const title = lines[0] || 'שיר מיובא';
    const lyrics = lines.slice(1).join('\n').trim();
    res.json({ title, lyrics });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/reorder', async (req, res) => {
  try {
    const { order } = req.body; // array of ids in new order
    const songs = await readSongs();
    order.forEach((id, index) => {
      const song = songs.find(s => s.id === id);
      if (song) song.order = index + 1;
    });
    await writeSongs(songs);
    res.json(songs.sort((a, b) => a.order - b.order));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const songs = await readSongs();
    const idx = songs.findIndex(s => s.id === id);
    if (idx === -1) return res.status(404).json({ error: 'לא נמצא' });
    songs[idx] = {
      ...songs[idx],
      ...req.body,
      id,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    await writeSongs(songs);
    res.json(songs[idx]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let songs = await readSongs();
    songs = songs.filter(s => s.id !== id);
    await writeSongs(songs);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
