import { useState } from 'react';

export default function Cover({ book = {}, onEnter }) {
  const title = book.title || 'שירי פאפו';
  const subtitle = book.subtitle || '';
  const author = book.author || '';
  const coverImage = book.coverImage || "/Screenshot 2026-02-22 at 21.34.07.png";
  const [btnHover, setBtnHover] = useState(false);

  return (
    <div style={styles.wrapper}>
      <div style={styles.page}>
        {/* Page edge shadow */}
        <div style={styles.pageEdge} />
        <div style={styles.border}>
          <div style={styles.ornament}>✦ ✦ ✦</div>
          <h1 style={styles.title}>{title}</h1>
          {subtitle && <h2 style={styles.subtitle}>{subtitle}</h2>}

          <div style={styles.photoFrame}>
            <img src={coverImage} alt="אבא" style={styles.photo} />
          </div>

          {author && <p style={styles.author}>{author}</p>}
          <div style={styles.divider} />
          <div style={styles.ornament}>✦ ✦ ✦</div>
          <button
            style={{ ...styles.button, ...(btnHover ? styles.buttonHover : {}) }}
            onClick={onEnter}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
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
    background: 'radial-gradient(ellipse at 50% 40%, #2e1a08 0%, #1a1008 65%)',
    padding: '2rem',
  },
  page: {
    background: 'linear-gradient(160deg, #f8edd8 0%, #f0e2c5 40%, #e8d4a8 100%)',
    boxShadow:
      '0 30px 80px rgba(0,0,0,0.8), ' +
      'inset 0 0 100px rgba(139,69,19,0.08), ' +
      '8px 10px 0 #6b3410, ' +
      '10px 12px 0 rgba(107,52,16,0.4)',
    maxWidth: '480px',
    width: '100%',
    padding: '3rem 2.5rem',
    borderRadius: '2px',
    position: 'relative',
  },
  pageEdge: {
    position: 'absolute',
    top: '6px',
    right: '-6px',
    bottom: '-6px',
    width: '8px',
    background: 'linear-gradient(to right, #5a2a0a, #3d1a06)',
    borderRadius: '0 2px 2px 0',
    zIndex: -1,
  },
  border: {
    border: '1.5px solid #c9a53d',
    boxShadow: 'inset 0 0 0 4px rgba(201,165,61,0.08)',
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
    textShadow: '1px 1px 3px rgba(139,69,19,0.15)',
  },
  subtitle: {
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '1.15rem',
    color: '#7a5c3a',
    fontWeight: '300',
    letterSpacing: '0.08em',
  },
  photoFrame: {
    width: '165px',
    height: '165px',
    borderRadius: '50%',
    border: '3px solid #c9a53d',
    overflow: 'hidden',
    boxShadow: '0 6px 24px rgba(139,69,19,0.35), 0 0 0 6px rgba(201,165,61,0.1)',
    flexShrink: 0,
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center top',
    filter: 'sepia(15%) contrast(1.05)',
  },
  author: {
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '1.1rem',
    color: '#8b4513',
    fontStyle: 'italic',
    letterSpacing: '0.03em',
  },
  divider: {
    width: '55%',
    height: '1px',
    background: 'linear-gradient(to right, transparent, #c9a53d, transparent)',
  },
  button: {
    marginTop: '0.5rem',
    padding: '0.8rem 2.5rem',
    background: 'transparent',
    border: '1px solid rgba(139,69,19,0.5)',
    color: '#8b4513',
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '1.1rem',
    cursor: 'pointer',
    letterSpacing: '0.08em',
    transition: 'all 0.3s ease',
    borderRadius: '2px',
  },
  buttonHover: {
    background: 'rgba(139,69,19,0.08)',
    border: '1px solid #8b4513',
    color: '#5a2a0a',
    boxShadow: '0 2px 12px rgba(139,69,19,0.15)',
  },
};
