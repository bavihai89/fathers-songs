import { existsSync, mkdirSync } from 'fs';
import { copyFile, readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// In production with a Railway Volume, set PERSISTENT_DIR to the mount path (e.g. /data)
// Without it, falls back to the git-tracked directories (dev mode)
const PERSISTENT_DIR = process.env.PERSISTENT_DIR;

export const DATA_DIR = PERSISTENT_DIR
  ? join(PERSISTENT_DIR, 'data')
  : join(ROOT, 'data');

export const IMAGES_DIR = PERSISTENT_DIR
  ? join(PERSISTENT_DIR, 'images')
  : join(ROOT, 'public', 'images');

export async function initPersistentStorage() {
  if (!PERSISTENT_DIR) return;

  mkdirSync(DATA_DIR, { recursive: true });
  mkdirSync(IMAGES_DIR, { recursive: true });

  // Seed JSON data files from git on first deploy
  for (const file of ['songs.json', 'book.json']) {
    const dest = join(DATA_DIR, file);
    const src = join(ROOT, 'data', file);
    if (!existsSync(dest) && existsSync(src)) {
      await copyFile(src, dest);
      console.log(`✦ Seeded ${file} to persistent storage`);
    }
  }

  // Copy committed images to persistent storage if not already there
  // (new images the father uploads/generates will also live here)
  const committedImages = join(ROOT, 'public', 'images');
  if (existsSync(committedImages)) {
    const files = await readdir(committedImages);
    let copied = 0;
    for (const file of files) {
      const dest = join(IMAGES_DIR, file);
      if (!existsSync(dest)) {
        await copyFile(join(committedImages, file), dest);
        copied++;
      }
    }
    if (copied > 0) console.log(`✦ Copied ${copied} images to persistent storage`);
  }
}
