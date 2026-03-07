import { useState } from 'react';
import Cover from './components/Cover';
import TableOfContents from './components/TableOfContents';
import SongPage from './components/SongPage';

// Views: 'cover' | 'toc' | 'song'
export default function App() {
  const [view, setView] = useState('cover');
  const [songIndex, setSongIndex] = useState(0);

  function openSong(index) {
    setSongIndex(index);
    setView('song');
  }

  return (
    <>
      {view === 'cover' && (
        <Cover onEnter={() => setView('toc')} />
      )}
      {view === 'toc' && (
        <TableOfContents
          onSelectSong={openSong}
          onBack={() => setView('cover')}
        />
      )}
      {view === 'song' && (
        <SongPage
          index={songIndex}
          onNext={() => openSong(songIndex + 1)}
          onPrev={() => openSong(songIndex - 1)}
          onBack={() => setView('toc')}
        />
      )}
    </>
  );
}
