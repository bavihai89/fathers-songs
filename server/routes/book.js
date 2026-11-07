import { Router } from 'express';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../../data/book.json');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const raw = await readFile(DATA_PATH, 'utf-8');
    res.json(JSON.parse(raw));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const raw = await readFile(DATA_PATH, 'utf-8');
    const current = JSON.parse(raw);
    const updated = { ...current, ...req.body };
    await writeFile(DATA_PATH, JSON.stringify(updated, null, 2), 'utf-8');
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
