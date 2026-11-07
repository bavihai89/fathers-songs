import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import songsRouter from './routes/songs.js';
import bookRouter from './routes/book.js';
import imagesRouter from './routes/images.js';
import audioRouter from './routes/audio.js';
import nikudRouter from './routes/nikud.js';

config({ path: join(dirname(fileURLToPath(import.meta.url)), '../.env') });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/songs', songsRouter);
app.use('/api/book', bookRouter);
app.use('/api/images', imagesRouter);
app.use('/api/audio', audioRouter);
app.use('/api/nikud', nikudRouter);

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
