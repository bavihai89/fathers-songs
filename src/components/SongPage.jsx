import { songs } from '../data/songs';

export default function SongPage({ index, onNext, onPrev, onBack }) {
  const song = songs[index];
  const isFirst = index === 0;
  const isLast = index === songs.length - 1;

  if (!song) return null;

  const stanzas = song.lyrics.split(/\n\n+/);

  return (
    <div style={styles.wrapper}>
      <div style={styles.page}>
        {/* Navigation top */}
        <div style={styles.topNav}>
          <button style={styles.navBtn} onClick={onBack}>תוכן עניינים</button>
          <span style={styles.pageNum}>{index + 1} / {songs.length}</span>
        </div>

        <div style={styles.divider} />

        {/* Song title */}
        <h2 style={styles.title}>{song.title}</h2>

        <div style={styles.ornament}>✦</div>

        {/* Dedication */}
        {song.dedication && (
          <p style={styles.dedication}>{song.dedication}</p>
        )}

        {/* Lyrics */}
        <div style={styles.lyrics}>
          {stanzas.map((stanza, i) => (
            <p key={i} style={styles.stanza}>
              {stanza.split('\n').map((line, j) => (
                <span key={j} style={styles.line}>
                  {line}
                  {j < stanza.split('\n').length - 1 && <br />}
                </span>
              ))}
            </p>
          ))}
        </div>

        <div style={styles.divider} />

        {/* Navigation bottom */}
        <div style={styles.bottomNav}>
          <button
            style={{ ...styles.arrowBtn, opacity: isLast ? 0.3 : 1 }}
            onClick={onNext}
            disabled={isLast}
          >
            ← שיר הבא
          </button>
          <button
            style={{ ...styles.arrowBtn, opacity: isFirst ? 0.3 : 1 }}
            onClick={onPrev}
            disabled={isFirst}
          >
            שיר קודם →
          </button>
        </div>
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
    background: 'linear-gradient(160deg, #f5ead6 0%, #ecdcbb 60%, #e8d4a8 100%)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.7), inset 0 0 80px rgba(139,69,19,0.08), 8px 8px 0 #8b4513',
    maxWidth: '560px',
    width: '100%',
    padding: '2.5rem 3rem',
    borderRadius: '2px',
  },
  topNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  navBtn: {
    background: 'none',
    border: 'none',
    color: '#8b4513',
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '0.9rem',
    cursor: 'pointer',
    padding: 0,
  },
  pageNum: {
    fontFamily: "'Frank Ruhl Libre', serif",
    color: '#c9a53d',
    fontSize: '0.85rem',
  },
  divider: {
    width: '100%',
    height: '1px',
    background: 'linear-gradient(to right, transparent, #c9a53d, transparent)',
    margin: '1rem 0',
  },
  title: {
    fontFamily: "'Secular One', 'Arial Hebrew', sans-serif",
    fontSize: '2.2rem',
    color: '#2c1a0e',
    fontWeight: '400',
    textAlign: 'center',
    margin: '1.5rem 0 0.5rem',
  },
  ornament: {
    textAlign: 'center',
    color: '#c9a53d',
    fontSize: '1.2rem',
    margin: '0.5rem 0 1.5rem',
  },
  lyrics: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  stanza: {
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '1.2rem',
    color: '#2c1a0e',
    lineHeight: 2,
    textAlign: 'center',
  },
  line: {
    display: 'inline',
  },
  dedication: {
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '0.95rem',
    color: '#8b4513',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  bottomNav: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '0.5rem',
  },
  arrowBtn: {
    background: 'none',
    border: 'none',
    color: '#8b4513',
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '0.95rem',
    cursor: 'pointer',
    padding: '0.25rem 0',
    transition: 'color 0.2s',
  },
};
