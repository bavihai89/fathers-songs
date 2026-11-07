import { useState } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

export default function SongPage({ songs = [], index, onNext, onPrev, onBack }) {
  const isMobile = useIsMobile();
  const finalSongs = songs.filter(s => s.status === 'final');
  const song = songs[index];
  const finalIndex = finalSongs.indexOf(song);
  const isFirst = finalIndex === 0;
  const isLast = finalIndex === finalSongs.length - 1;
  const [showNikud, setShowNikud] = useState(false);

  if (!song) return null;

  const hasNikud = !!song.lyricsNikud?.trim();
  const activeLyrics = showNikud && hasNikud ? song.lyricsNikud : song.lyrics;
  const stanzas = (activeLyrics || '').split(/\n\n+/);

  const mobileWrapper = isMobile ? { padding: 0 } : {};
  const mobilePage = isMobile ? { maxWidth: '100%', borderRadius: 0, boxShadow: 'none' } : {};
  const mobileContent = isMobile ? { padding: '1.2rem 1.1rem' } : {};
  const mobileTitle = isMobile ? { fontSize: '1.65rem' } : {};
  const mobileArrowBtn = isMobile ? { fontSize: '1.05rem', padding: '0.6rem 0.5rem', minWidth: '90px' } : {};

  return (
    <div style={{ ...styles.wrapper, ...mobileWrapper }}>
      <div style={{ ...styles.page, ...mobilePage }}>
        {/* Song image — full bleed at top */}
        {song.image && (
          <div style={styles.songImageWrap}>
            <img src={song.image} alt={song.title} style={styles.songImage} />
            <div style={styles.songImageFade} />
          </div>
        )}

        {/* Padded content area */}
        <div style={{ ...styles.content, ...mobileContent }}>

        {/* Navigation top */}
        <div style={styles.topNav}>
          <button style={styles.navBtn} onClick={onBack}>תוכן עניינים</button>
          <div style={styles.topRight}>
            {hasNikud && (
              <button
                style={{ ...styles.nikudToggle, ...(showNikud ? styles.nikudToggleOn : {}) }}
                onClick={() => setShowNikud(v => !v)}
                title={showNikud ? 'הצג ללא ניקוד' : 'הצג עם ניקוד'}
              >
                {showNikud ? 'ניקוד ✓' : 'ניקוד'}
              </button>
            )}
            <span style={styles.pageNum}>{finalIndex + 1} / {finalSongs.length}</span>
          </div>
        </div>

        <div style={styles.divider} />

        {/* Song title */}
        <h2 style={{ ...styles.title, ...mobileTitle }}>{song.title}</h2>

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

        {/* Story / written-at footer */}
        {(song.writtenAt || song.story) && (
          <div style={styles.footer}>
            <div style={styles.footerDivider} />
            {song.writtenAt && <div style={styles.writtenAt}>נכתב: {song.writtenAt}</div>}
            {song.story && <div style={styles.story}>{song.story}</div>}
          </div>
        )}

        <div style={styles.divider} />

        {/* Navigation bottom */}
        <div style={styles.bottomNav}>
          <button
            style={{ ...styles.arrowBtn, ...mobileArrowBtn, opacity: isLast ? 0.3 : 1 }}
            onClick={onNext}
            disabled={isLast}
          >
            ← שיר הבא
          </button>
          <button
            style={{ ...styles.arrowBtn, ...mobileArrowBtn, opacity: isFirst ? 0.3 : 1 }}
            onClick={onPrev}
            disabled={isFirst}
          >
            שיר קודם →
          </button>
        </div>

        </div> {/* end content */}
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
    padding: '0',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  songImageWrap: {
    position: 'relative',
    width: '100%',
    height: '220px',
    overflow: 'hidden',
  },
  songImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  songImageFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70px',
    background: 'linear-gradient(to bottom, transparent, #f0dfc0)',
    pointerEvents: 'none',
  },
  content: {
    padding: '2.5rem 3rem',
  },
  topNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  topRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
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
  nikudToggle: {
    background: 'transparent',
    border: '1px solid rgba(201,165,61,0.35)',
    borderRadius: '20px',
    color: 'rgba(44,26,14,0.45)',
    fontFamily: "'Heebo', sans-serif",
    fontSize: '0.76rem',
    padding: '0.2rem 0.65rem',
    cursor: 'pointer',
    transition: 'all 0.15s',
    letterSpacing: '0.03em',
  },
  nikudToggleOn: {
    background: 'rgba(201,165,61,0.12)',
    color: '#8b6914',
    borderColor: 'rgba(201,165,61,0.5)',
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
    margin: 0,
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
  footer: {
    marginTop: '2rem',
  },
  footerDivider: {
    height: '1px',
    background: 'linear-gradient(to right, transparent, rgba(201,165,61,0.3), transparent)',
    marginBottom: '1rem',
  },
  writtenAt: {
    fontFamily: "'Heebo', sans-serif",
    fontSize: '0.78rem',
    color: 'rgba(44,26,14,0.45)',
    textAlign: 'center',
    marginBottom: '0.5rem',
    letterSpacing: '0.03em',
  },
  story: {
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '0.9rem',
    color: 'rgba(44,26,14,0.55)',
    fontStyle: 'italic',
    lineHeight: '1.75',
    textAlign: 'right',
    whiteSpace: 'pre-wrap',
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
