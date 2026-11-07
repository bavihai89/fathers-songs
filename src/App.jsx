import { useState } from 'react';
import Cover from './components/Cover';
import TableOfContents from './components/TableOfContents';
import SongPage from './components/SongPage';
import AboutAuthor from './components/AboutAuthor';
import StudioLayout from './studio/StudioLayout';
import { useSongs } from './hooks/useSongs';
import { useBook } from './hooks/useBook';

export default function App() {
  const [view, setView] = useState('cover');
  const [songIndex, setSongIndex] = useState(0);
  const [isStudio, setIsStudio] = useState(false);
  const { songs, loading, createSong, updateSong, deleteSong, reorderSongs } = useSongs();
  const { book, updateBook } = useBook();

  function openSong(index) {
    setSongIndex(index);
    setView('song');
  }

  if (loading) return <LoadingScreen />;

  if (isStudio) {
    return (
      <StudioLayout
        songs={songs}
        book={book}
        onExitStudio={() => setIsStudio(false)}
        onCreateSong={createSong}
        onUpdateSong={updateSong}
        onDeleteSong={deleteSong}
        onReorderSongs={reorderSongs}
        onUpdateBook={updateBook}
      />
    );
  }

  return (
    <>
      <StudioToggleBtn onClick={() => setIsStudio(true)} />
      {view === 'cover' && (
        <Cover book={book} onEnter={() => setView('toc')} />
      )}
      {view === 'toc' && (
        <TableOfContents
          songs={songs}
          onSelectSong={openSong}
          onBack={() => setView('cover')}
          onAbout={() => setView('about')}
        />
      )}
      {view === 'song' && (
        <SongPage
          songs={songs}
          index={songIndex}
          onNext={() => openSong(songIndex + 1)}
          onPrev={() => openSong(songIndex - 1)}
          onBack={() => setView('toc')}
        />
      )}
      {view === 'about' && (
        <AboutAuthor book={book} songs={songs} onBack={() => setView('toc')} />
      )}
    </>
  );
}

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, #2e1a08 0%, #1a1008 70%)',
      fontFamily: "'Frank Ruhl Libre', serif",
      color: '#c9a53d',
      fontSize: '1.5rem',
    }}>
      ✦
    </div>
  );
}

function StudioToggleBtn({ onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'fixed',
        top: '1.1rem',
        left: '1.1rem',
        zIndex: 1000,
        background: hover
          ? 'rgba(201,165,61,0.18)'
          : 'rgba(15,8,2,0.55)',
        border: `1px solid ${hover ? 'rgba(201,165,61,0.6)' : 'rgba(201,165,61,0.3)'}`,
        borderRadius: '24px',
        padding: '0.45rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        cursor: 'pointer',
        color: hover ? '#c9a53d' : 'rgba(201,165,61,0.65)',
        fontSize: '0.88rem',
        fontFamily: "'Heebo', sans-serif",
        fontWeight: '500',
        letterSpacing: '0.03em',
        transition: 'all 0.22s ease',
        backdropFilter: 'blur(8px)',
        boxShadow: hover
          ? '0 4px 16px rgba(0,0,0,0.4)'
          : '0 2px 8px rgba(0,0,0,0.3)',
        whiteSpace: 'nowrap',
      }}
      title="עבור למצב עריכה"
    >
      <span style={{ fontSize: '0.8rem' }}>✦</span>
      <span>עריכה</span>
    </button>
  );
}
