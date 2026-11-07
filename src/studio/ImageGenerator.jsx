import { useState } from 'react';

const C = {
  gold: '#c9a53d',
  muted: '#7a5c3a',
  border: 'rgba(201,165,61,0.2)',
  parchment: '#f5ead6',
  inputBg: 'rgba(245,234,214,0.06)',
  inputBorder: 'rgba(201,165,61,0.3)',
};

// mode: 'lyrics' | 'description'
export default function ImageGenerator({ onGenerated, onClose, lyrics = '', songTitle = '' }) {
  const [mode, setMode] = useState('lyrics');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const hasLyrics = !!lyrics.trim();

  async function handleGenerate() {
    const source = mode === 'lyrics' ? lyrics : description;
    if (!source.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/images/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: source }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.path);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const canGenerate = !loading && (mode === 'lyrics' ? hasLyrics : !!description.trim());

  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <div style={styles.header}>
          <h3 style={styles.title}>✨ יצירת תמונה עם AI</h3>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Mode selector */}
        <div style={styles.modeRow}>
          <button
            style={{ ...styles.modeBtn, ...(mode === 'lyrics' ? styles.modeBtnActive : {}) }}
            onClick={() => setMode('lyrics')}
          >
            על בסיס מילות השיר
          </button>
          <button
            style={{ ...styles.modeBtn, ...(mode === 'description' ? styles.modeBtnActive : {}) }}
            onClick={() => setMode('description')}
          >
            תיאור חופשי
          </button>
        </div>

        {mode === 'lyrics' ? (
          <div style={styles.lyricsPreview}>
            {hasLyrics ? (
              <>
                <p style={styles.lyricsHint}>
                  ה-AI יקרא את מילות השיר ויצור תמונה שמתאימה לרוח ולתוכן שלו.
                </p>
                <div style={styles.lyricsSnippet} dir="rtl">
                  {lyrics.split('\n').slice(0, 3).join('\n')}
                  {lyrics.split('\n').length > 3 && '\n…'}
                </div>
              </>
            ) : (
              <p style={styles.noLyrics}>אין מילות שיר עדיין — כתוב את השיר ואז צור תמונה.</p>
            )}
          </div>
        ) : (
          <div>
            <p style={styles.desc}>
              תאר את הנוף, הסצנה או הרגש שתרצה לראות ליד השיר.
            </p>
            <textarea
              style={styles.textarea}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="לדוגמה: שדה פרחים בשקיעה עם הרי יהודה ברקע, טון חם ונוסטלגי..."
              dir="rtl"
              rows={4}
            />
          </div>
        )}

        <button
          style={{ ...styles.genBtn, opacity: canGenerate ? 1 : 0.5 }}
          onClick={handleGenerate}
          disabled={!canGenerate}
        >
          {loading ? '⏳ יוצר תמונה...' : '✨ צור תמונה'}
        </button>

        {error && (
          <div style={styles.error}>
            <strong>שגיאה:</strong> {error}
          </div>
        )}

        {result && (
          <div style={styles.resultArea}>
            <img src={result} alt="תמונה שנוצרה" style={styles.resultImg} />
            <div style={styles.resultActions}>
              <button style={styles.useBtn} onClick={() => onGenerated(result)}>השתמש בתמונה זו</button>
              <button style={styles.regenBtn} onClick={handleGenerate}>⟳ נסה שוב</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    fontFamily: "'Frank Ruhl Libre', serif",
  },
  dialog: {
    background: '#1e1208',
    border: `1px solid ${C.border}`,
    borderRadius: '14px',
    padding: '2rem',
    maxWidth: '480px',
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: C.gold, fontSize: '1.15rem', fontWeight: 'normal', margin: 0 },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: C.muted,
    fontSize: '1.1rem',
    cursor: 'pointer',
    padding: '0.25rem',
  },
  modeRow: {
    display: 'flex',
    gap: '0.5rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    padding: '0.3rem',
  },
  modeBtn: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: C.muted,
    padding: '0.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontFamily: "'Frank Ruhl Libre', serif",
    transition: 'all 0.15s',
  },
  modeBtnActive: {
    background: 'rgba(201,165,61,0.15)',
    color: C.gold,
  },
  lyricsPreview: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  lyricsHint: {
    color: C.muted,
    fontSize: '0.88rem',
    margin: 0,
    lineHeight: 1.6,
  },
  lyricsSnippet: {
    background: 'rgba(245,234,214,0.04)',
    border: `1px solid ${C.border}`,
    borderRadius: '8px',
    padding: '0.75rem',
    color: 'rgba(245,234,214,0.5)',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    whiteSpace: 'pre-wrap',
    lineHeight: 1.8,
  },
  noLyrics: {
    color: 'rgba(201,165,61,0.4)',
    fontSize: '0.9rem',
    textAlign: 'center',
    padding: '1rem',
    margin: 0,
  },
  desc: { color: C.muted, fontSize: '0.9rem', margin: 0, lineHeight: 1.6 },
  textarea: {
    background: C.inputBg,
    border: `1px solid ${C.inputBorder}`,
    borderRadius: '8px',
    padding: '0.75rem',
    color: C.parchment,
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '1rem',
    outline: 'none',
    resize: 'vertical',
    lineHeight: 1.7,
    width: '100%',
    boxSizing: 'border-box',
  },
  genBtn: {
    background: C.gold,
    border: 'none',
    color: '#1a1008',
    padding: '0.7rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontFamily: "'Frank Ruhl Libre', serif",
    fontWeight: 'bold',
  },
  error: {
    background: 'rgba(139,69,19,0.2)',
    border: '1px solid rgba(139,69,19,0.4)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#e88a4a',
    fontSize: '0.9rem',
  },
  resultArea: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  resultImg: {
    width: '100%',
    borderRadius: '8px',
    border: `1px solid ${C.border}`,
    display: 'block',
  },
  resultActions: { display: 'flex', gap: '0.75rem' },
  useBtn: {
    flex: 1,
    background: C.gold,
    border: 'none',
    color: '#1a1008',
    padding: '0.65rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontFamily: "'Frank Ruhl Libre', serif",
    fontWeight: 'bold',
  },
  regenBtn: {
    background: 'transparent',
    border: `1px solid ${C.border}`,
    color: C.muted,
    padding: '0.65rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontFamily: "'Frank Ruhl Libre', serif",
  },
};
