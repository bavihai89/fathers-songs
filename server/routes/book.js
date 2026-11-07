import { Router } from 'express';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { DATA_DIR } from '../init.js';

const DATA_PATH = join(DATA_DIR, 'book.json');

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
