function firstLine(lyrics) {
  if (!lyrics) return '';
  return lyrics.split('\n').find(l => l.trim()) || '';
}

export default function TableOfContents({ songs = [], onSelectSong, onBack, onAbout }) {
  const finalSongs = songs.filter(s => s.status === 'final');
  return (
    <div style={styles.wrapper}>
      <div style={styles.page}>
        <button style={styles.backBtn} onClick={onBack}>← עטיפה</button>
        <h2 style={styles.heading}>תוכן העניינים</h2>
        <div style={styles.divider} />
        {finalSongs.length === 0 ? (
          <p style={styles.empty}>השירים יתווספו בקרוב...</p>
        ) : (
          <ol style={styles.list}>
            {finalSongs.map((song, index) => (
              <li key={song.id} style={styles.item}>
                <button style={styles.songBtn} onClick={() => onSelectSong(songs.indexOf(song))}>
                  <span style={styles.number}>{index + 1}</span>
                  <span style={styles.songInfo}>
                    <span style={styles.songTitle}>{song.title}</span>
                    {firstLine(song.lyrics) && (
                      <span style={styles.firstLine}>{firstLine(song.lyrics)}</span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        )}
        {onAbout && (
          <div style={styles.aboutWrap}>
            <div style={styles.aboutDivider} />
            <button style={styles.aboutBtn} onClick={onAbout}>על המחבר ✦</button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at center, #2e1a08 0%, #1a1008 70%)',
    padding: '3rem 2rem',
  },
  page: {
    background: 'linear-gradient(160deg, #f5ead6 0%, #ecdcbb 50%, #e8d4a8 100%)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.7), inset 0 0 80px rgba(139,69,19,0.1), 8px 8px 0 #8b4513',
    maxWidth: '540px',
    width: '100%',
    padding: '3rem 2.5rem',
    borderRadius: '2px',
    position: 'relative',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#8b4513',
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '0.95rem',
    cursor: 'pointer',
    marginBottom: '1.5rem',
    display: 'block',
    padding: 0,
  },
  heading: {
    fontFamily: "'Secular One', 'Arial Hebrew', sans-serif",
    fontSize: '2rem',
    color: '#2c1a0e',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: '0.75rem',
  },
  divider: {
    width: '100%',
    height: '1px',
    background: 'linear-gradient(to right, transparent, #c9a53d, transparent)',
    marginBottom: '2rem',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  item: {
    borderBottom: '1px solid rgba(201, 165, 61, 0.3)',
  },
  songBtn: {
    width: '100%',
    background: 'none',
    border: 'none',
    padding: '0.85rem 0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    cursor: 'pointer',
    textAlign: 'right',
    transition: 'background 0.2s',
  },
  number: {
    fontFamily: "'Frank Ruhl Libre', serif",
    color: '#c9a53d',
    fontSize: '0.9rem',
    minWidth: '1.5rem',
    textAlign: 'center',
    flexShrink: 0,
  },
  songInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    textAlign: 'right',
  },
  songTitle: {
    fontFamily: "'Frank Ruhl Libre', serif",
    color: '#2c1a0e',
    fontSize: '1.15rem',
  },
  firstLine: {
    fontFamily: "'Frank Ruhl Libre', serif",
    color: 'rgba(44,26,14,0.45)',
    fontSize: '0.82rem',
    fontStyle: 'italic',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
    display: 'block',
  },
  empty: {
    fontFamily: "'Frank Ruhl Libre', serif",
    color: '#7a5c3a',
    textAlign: 'center',
    fontSize: '1.1rem',
    fontStyle: 'italic',
    padding: '2rem 0',
  },
  aboutWrap: { marginTop: '1.75rem', textAlign: 'center' },
  aboutDivider: {
    height: '1px',
    background: 'linear-gradient(to right, transparent, rgba(201,165,61,0.3), transparent)',
    marginBottom: '1.25rem',
  },
  aboutBtn: {
    background: 'none',
    border: '1px solid rgba(201,165,61,0.35)',
    borderRadius: '20px',
    color: '#8b6914',
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '0.95rem',
    padding: '0.5rem 1.5rem',
    cursor: 'pointer',
    letterSpacing: '0.03em',
    transition: 'all 0.2s',
  },
};
