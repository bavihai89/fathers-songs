import { bookMeta } from '../data/songs';

export default function Cover({ onEnter }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.page}>
        <div style={styles.border}>
          <div style={styles.ornament}>✦ ✦ ✦</div>
          <h1 style={styles.title}>{bookMeta.title}</h1>
          {bookMeta.subtitle && (
            <h2 style={styles.subtitle}>{bookMeta.subtitle}</h2>
          )}

          <div style={styles.photoFrame}>
            <img
              src="/Screenshot 2026-02-22 at 21.34.07.png"
              alt="אבא"
              style={styles.photo}
            />
          </div>

          {bookMeta.author && (
            <p style={styles.author}>{bookMeta.author}</p>
          )}
          <div style={styles.divider} />
          <div style={styles.ornament}>✦ ✦ ✦</div>
          <button style={styles.button} onClick={onEnter}>
            פתח את הספר
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
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at center, #2e1a08 0%, #1a1008 70%)',
    padding: '2rem',
  },
  page: {
    background: 'linear-gradient(160deg, #f5ead6 0%, #ecdcbb 50%, #e8d4a8 100%)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.7), inset 0 0 80px rgba(139,69,19,0.1), 8px 8px 0 #8b4513',
    maxWidth: '480px',
    width: '100%',
    padding: '3rem 2.5rem',
    borderRadius: '2px',
    position: 'relative',
  },
  border: {
    border: '2px solid #c9a53d',
    padding: '2.5rem 2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
  },
  ornament: {
    color: '#c9a53d',
    fontSize: '1rem',
    letterSpacing: '0.5rem',
  },
  title: {
    fontFamily: "'Secular One', 'Arial Hebrew', sans-serif",
    fontSize: '3.5rem',
    color: '#2c1a0e',
    fontWeight: '400',
    lineHeight: 1.2,
    textShadow: '1px 1px 2px rgba(139,69,19,0.2)',
  },
  subtitle: {
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '1.2rem',
    color: '#7a5c3a',
    fontWeight: '300',
    letterSpacing: '0.05em',
  },
  photoFrame: {
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    border: '3px solid #c9a53d',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(139,69,19,0.3)',
    flexShrink: 0,
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center top',
    filter: 'sepia(15%)',
  },
  author: {
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '1.1rem',
    color: '#8b4513',
    fontStyle: 'italic',
  },
  divider: {
    width: '60%',
    height: '1px',
    background: 'linear-gradient(to right, transparent, #c9a53d, transparent)',
  },
  button: {
    marginTop: '0.5rem',
    padding: '0.75rem 2rem',
    background: 'transparent',
    border: '1px solid #8b4513',
    color: '#8b4513',
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '1.1rem',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    transition: 'all 0.3s ease',
    borderRadius: '1px',
  },
};
