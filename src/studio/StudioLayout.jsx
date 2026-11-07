import { useState } from 'react';
import SongList from './SongList';
import SongEditor from './SongEditor';
import BookEditor from './BookEditor';
import ExportPanel from './ExportPanel';
import { useIsMobile } from '../hooks/useIsMobile';

const NAV = [
  { id: 'songs', label: 'שירים', icon: '✦' },
  { id: 'book', label: 'הספר', icon: '◈' },
  { id: 'export', label: 'ייצוא', icon: '◇' },
];

export default function StudioLayout({
  songs, book, onExitStudio,
  onCreateSong, onUpdateSong, onDeleteSong, onReorderSongs, onUpdateBook,
}) {
  const [section, setSection] = useState('songs');
  const [selectedSong, setSelectedSong] = useState(null);
  const isMobile = useIsMobile();

  function handleSelectSong(song) { setSelectedSong(song); }

  function handleSongSaved(id, data) {
    onUpdateSong(id, data);
    setSelectedSong(prev => prev?.id === id ? { ...prev, ...data } : prev);
  }

  async function handleNewSong() {
    const song = await onCreateSong({ title: 'שיר חדש', status: 'draft' });
    setSelectedSong(song);
  }

  async function handleImportSong(data) {
    const song = await onCreateSong({ ...data, status: 'draft' });
    setSelectedSong(song);
    setSection('songs');
  }

  async function handleDeleteSong(id) {
    await onDeleteSong(id);
    setSelectedSong(null);
  }

  return (
    <div style={S.root}>
      {/* Top bar — always visible */}
      <div style={S.topBar}>
        <div style={S.topBarRight}>
          <span style={S.topBarBadge}>✦ מצב עריכה</span>
          <span style={S.topBarTitle}>{book.title || 'שירי פאפו'}</span>
        </div>
        <button style={S.topBarExitBtn} onClick={onExitStudio}>
          ← צפייה בספר
        </button>
      </div>

      {/* Body */}
      <div style={{ ...S.body, flexDirection: isMobile ? 'column' : 'row' }}>
      {/* Sidebar — hidden on mobile, replaced by bottom tab bar */}
      <aside style={{ ...S.sidebar, display: isMobile ? 'none' : 'flex' }}>
        <div style={S.sidebarTop}>
          <div style={S.logoTitle}>{book.title || 'שירי פאפו'}</div>
          <div style={S.logoSub}>סטודיו עריכה</div>
        </div>

        <div style={S.sidebarDivider} />

        <nav style={S.nav}>
          {NAV.map(item => (
            <button
              key={item.id}
              style={{ ...S.navBtn, ...(section === item.id ? S.navBtnActive : {}) }}
              onClick={() => { setSection(item.id); setSelectedSong(null); }}
            >
              <span style={{ ...S.navIcon, ...(section === item.id ? S.navIconActive : {}) }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {section === item.id && <span style={S.navIndicator} />}
            </button>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        <div style={S.sidebarBottom}>
          <div style={S.songCount}>{songs.length} שירים · {songs.filter(s=>s.status==='final').length} סופיים</div>
        </div>
      </aside>

      {/* Main */}
      <main style={S.main}>
        {section === 'songs' && (
          isMobile ? (
            // Mobile: show list OR editor, not split
            selectedSong ? (
              <div style={{ flex: 1, overflow: 'auto' }}>
                <button
                  onClick={() => setSelectedSong(null)}
                  style={S.mobileBackBtn}
                >
                  ← חזרה לרשימה
                </button>
                <SongEditor key={selectedSong.id} song={selectedSong} onSave={handleSongSaved} onDelete={handleDeleteSong} />
              </div>
            ) : (
              <div style={{ flex: 1, overflow: 'auto' }}>
                <SongList
                  songs={songs}
                  selectedId={selectedSong?.id}
                  onSelect={handleSelectSong}
                  onNew={handleNewSong}
                  onImport={handleImportSong}
                />
              </div>
            )
          ) : (
            <div style={S.splitPane}>
              <div style={S.listPane}>
                <SongList
                  songs={songs}
                  selectedId={selectedSong?.id}
                  onSelect={handleSelectSong}
                  onNew={handleNewSong}
                  onImport={handleImportSong}
                />
              </div>
              <div style={S.editorPane}>
                {selectedSong
                  ? <SongEditor key={selectedSong.id} song={selectedSong} onSave={handleSongSaved} onDelete={handleDeleteSong} />
                  : <EmptyEditor onNew={handleNewSong} />
                }
              </div>
            </div>
          )
        )}
        {section === 'book' && (
          <BookEditor songs={songs} book={book} onUpdateBook={onUpdateBook} onReorderSongs={onReorderSongs} onUpdateSong={onUpdateSong} />
        )}
        {section === 'export' && (
          <ExportPanel songs={songs} book={book} />
        )}
      </main>
      </div>

      {/* Mobile bottom tab bar */}
      {isMobile && (
        <nav style={S.mobileTabBar}>
          {NAV.map(item => (
            <button
              key={item.id}
              style={{ ...S.mobileTab, ...(section === item.id ? S.mobileTabActive : {}) }}
              onClick={() => { setSection(item.id); setSelectedSong(null); }}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              <span style={{ fontSize: '0.72rem' }}>{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

function EmptyEditor({ onNew }) {
  return (
    <div style={S.empty}>
      <div style={S.emptyOrnament}>✦</div>
      <p style={S.emptyTitle}>בחר שיר לעריכה</p>
      <p style={S.emptyText}>או צור שיר חדש כדי להתחיל</p>
      <button style={S.emptyBtn} onClick={onNew}>+ שיר חדש</button>
    </div>
  );
}

const S = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    background: '#231810',
    direction: 'rtl',
    fontFamily: "'Heebo', 'Arial Hebrew', sans-serif",
    color: '#c8b090',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1.25rem',
    height: '48px',
    flexShrink: 0,
    background: 'linear-gradient(to left, #150f07 0%, #1a1108 100%)',
    borderBottom: '1px solid rgba(201,165,61,0.18)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
    zIndex: 10,
  },
  topBarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  topBarBadge: {
    background: 'rgba(201,165,61,0.12)',
    border: '1px solid rgba(201,165,61,0.3)',
    borderRadius: '20px',
    padding: '0.18rem 0.7rem',
    color: '#c9a53d',
    fontSize: '0.75rem',
    fontFamily: "'Heebo', sans-serif",
    fontWeight: '600',
    letterSpacing: '0.08em',
  },
  topBarTitle: {
    color: 'rgba(232,213,176,0.5)',
    fontSize: '0.9rem',
    fontFamily: "'Frank Ruhl Libre', serif",
    letterSpacing: '0.03em',
  },
  topBarExitBtn: {
    background: 'rgba(201,165,61,0.1)',
    border: '1px solid rgba(201,165,61,0.35)',
    color: '#c9a53d',
    padding: '0.42rem 1.1rem',
    borderRadius: '22px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontFamily: "'Heebo', sans-serif",
    fontWeight: '600',
    letterSpacing: '0.02em',
    transition: 'all 0.18s',
    whiteSpace: 'nowrap',
  },
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    width: '220px',
    flexShrink: 0,
    background: 'linear-gradient(180deg, #150f07 0%, #1c1409 100%)',
    borderLeft: '1px solid rgba(201,165,61,0.12)',
    display: 'flex',
    flexDirection: 'column',
    padding: '0',
    position: 'relative',
  },
  sidebarTop: {
    padding: '1.75rem 1.5rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.25rem',
  },
  modeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    background: 'rgba(201,165,61,0.12)',
    border: '1px solid rgba(201,165,61,0.25)',
    borderRadius: '20px',
    padding: '0.2rem 0.65rem',
    color: '#c9a53d',
    fontSize: '0.72rem',
    fontFamily: "'Heebo', sans-serif",
    fontWeight: '500',
    letterSpacing: '0.08em',
    marginBottom: '0.75rem',
  },
  logoMark: {
    color: '#c9a53d',
    fontSize: '1.3rem',
    lineHeight: 1,
  },
  logoTitle: {
    color: '#e8d5b0',
    fontSize: '1.2rem',
    letterSpacing: '0.04em',
    fontWeight: '600',
    fontFamily: "'Heebo', sans-serif",
  },
  logoSub: {
    color: 'rgba(201,165,61,0.45)',
    fontSize: '0.76rem',
    fontFamily: "'Frank Ruhl Libre', serif",
    letterSpacing: '0.04em',
  },
  sidebarDivider: {
    height: '1px',
    background: 'linear-gradient(to left, transparent, rgba(201,165,61,0.2), transparent)',
    margin: '0 1rem',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem 0.75rem',
    gap: '0.15rem',
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    padding: '0.7rem 0.9rem',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: 'rgba(200,176,144,0.5)',
    fontSize: '0.95rem',
    fontFamily: "'Heebo', sans-serif",
    fontWeight: '400',
    cursor: 'pointer',
    textAlign: 'right',
    transition: 'all 0.18s',
    position: 'relative',
  },
  navBtnActive: {
    background: 'rgba(201,165,61,0.1)',
    color: '#e8d5b0',
    fontWeight: '500',
  },
  navIcon: {
    color: 'rgba(201,165,61,0.3)',
    fontSize: '0.85rem',
    transition: 'color 0.18s',
    width: '1rem',
    textAlign: 'center',
  },
  navIconActive: { color: '#c9a53d' },
  navIndicator: {
    position: 'absolute',
    left: '0',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '3px',
    height: '55%',
    background: 'linear-gradient(180deg, #c9a53d, rgba(201,165,61,0.5))',
    borderRadius: '0 2px 2px 0',
  },
  sidebarBottom: {
    padding: '1rem 1.1rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    borderTop: '1px solid rgba(201,165,61,0.08)',
  },
  songCount: {
    color: 'rgba(201,165,61,0.35)',
    fontSize: '0.72rem',
    textAlign: 'center',
    fontFamily: "'Heebo', sans-serif",
    letterSpacing: '0.04em',
  },
  main: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
  },
  splitPane: { flex: 1, display: 'flex', overflow: 'hidden' },
  listPane: {
    width: '290px',
    flexShrink: 0,
    borderLeft: '1px solid rgba(201,165,61,0.1)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  editorPane: { flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  empty: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: '2rem',
  },
  emptyOrnament: { color: 'rgba(201,165,61,0.2)', fontSize: '2.5rem', marginBottom: '0.5rem' },
  emptyTitle: { color: 'rgba(212,184,150,0.5)', fontSize: '1.1rem', margin: 0 },
  emptyText: { color: 'rgba(212,184,150,0.3)', fontSize: '0.9rem', margin: 0 },
  emptyBtn: {
    marginTop: '1rem',
    background: 'transparent',
    border: '1px solid rgba(201,165,61,0.35)',
    color: '#c9a53d',
    padding: '0.65rem 1.75rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontFamily: "'Frank Ruhl Libre', serif",
    letterSpacing: '0.03em',
    transition: 'all 0.2s',
  },
  mobileTabBar: {
    display: 'flex',
    borderTop: '1px solid rgba(201,165,61,0.18)',
    background: '#150f07',
    flexShrink: 0,
  },
  mobileTab: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.2rem',
    padding: '0.65rem 0.5rem',
    background: 'transparent',
    border: 'none',
    color: 'rgba(200,176,144,0.45)',
    cursor: 'pointer',
    fontFamily: "'Heebo', sans-serif",
  },
  mobileTabActive: {
    color: '#c9a53d',
    background: 'rgba(201,165,61,0.07)',
  },
  mobileBackBtn: {
    display: 'block',
    background: 'none',
    border: 'none',
    color: '#c9a53d',
    fontFamily: "'Heebo', sans-serif",
    fontSize: '0.9rem',
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    borderBottom: '1px solid rgba(201,165,61,0.12)',
    width: '100%',
    textAlign: 'right',
  },
};
