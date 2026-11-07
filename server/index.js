import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { config } from 'dotenv';
import songsRouter from './routes/songs.js';
import bookRouter from './routes/book.js';
import imagesRouter from './routes/images.js';
import audioRouter from './routes/audio.js';
import nikudRouter from './routes/nikud.js';

config({ path: join(dirname(fileURLToPath(import.meta.url)), '../.env') });

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use('/images', express.static(join(__dirname, '../public/images')));

app.use('/api/songs', songsRouter);
app.use('/api/book', bookRouter);
app.use('/api/images', imagesRouter);
app.use('/api/audio', audioRouter);
app.use('/api/nikud', nikudRouter);

// In production, serve the built Vite frontend
if (isProd) {
  const distPath = join(__dirname, '../dist');
  app.use(express.static(distPath));
  // SPA fallback — app.get('*') is broken in Express 5; use middleware instead
  app.use((req, res) => res.sendFile(join(distPath, 'index.html')));
}

const server = app.listen(PORT, () => {
  console.log(`✦ שרת שירי פאפו פועל על פורט ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`⚠ פורט ${PORT} תפוס — שרת קיים פועל, ממשיך עם זה`);
    process.exit(0);
  } else {
    throw err;
  }
});
