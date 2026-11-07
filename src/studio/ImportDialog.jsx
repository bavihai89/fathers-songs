import { useState, useRef } from 'react';

export default function ImportDialog({ onImport, onClose }) {
  const [mode, setMode] = useState('file'); // 'file' | 'paste'
  const [pasteText, setPasteText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/songs/import/docx', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'שגיאה בייבוא');
      onImport({ title: data.title, lyrics: data.lyrics });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePaste() {
    if (!pasteText.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/songs/import/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: pasteText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'שגיאה בייבוא');
      onImport({ title: data.title, lyrics: data.lyrics });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={S.overlay}>
      <div style={S.dialog}>
        <button style={S.closeBtn} onClick={onClose}>✕</button>
        <div style={S.icon}>✦</div>
        <div style={S.title}>ייבוא שיר</div>

        {/* Mode tabs */}
        <div style={S.tabs}>
          <button
            style={{ ...S.tab, ...(mode === 'file' ? S.tabActive : {}) }}
            onClick={() => setMode('file')}
          >
            קובץ Word / DOCX
          </button>
          <button
            style={{ ...S.tab, ...(mode === 'paste' ? S.tabActive : {}) }}
            onClick={() => setMode('paste')}
          >
            הדבק טקסט
          </button>
        </div>

        {mode === 'file' && (
          <div style={S.fileSection}>
            <p style={S.hint}>
              העלה קובץ <strong>.docx</strong> מ-Word או Google Docs.
              <br />
              <span style={S.hintSmall}>
                מ-Google Docs: קובץ ← הורד ← Microsoft Word (.docx)
              </span>
            </p>
            <button
              style={S.uploadBtn}
              onClick={() => fileRef.current?.click()}
              disabled={loading}
            >
              {loading ? 'מייבא…' : '⬆ בחר קובץ .docx'}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              style={{ display: 'none' }}
              onChange={handleFile}
            />
          </div>
        )}

        {mode === 'paste' && (
          <div style={S.pasteSection}>
            <p style={S.hint}>
              העתק את טקסט השיר מ-Google Docs, Word, או כל מקום אחר.
              <br />
              <span style={S.hintSmall}>השורה הראשונה תהפוך לשם השיר.</span>
            </p>
            <textarea
              style={S.pasteArea}
              value={pasteText}
              onChange={e => setPasteText(e.target.value)}
              placeholder="הדבק את השיר כאן…"
              dir="rtl"
              rows={8}
            />
            <button
              style={{ ...S.uploadBtn, opacity: pasteText.trim() ? 1 : 0.5 }}
              onClick={handlePaste}
              disabled={loading || !pasteText.trim()}
            >
              {loading ? 'מייבא…' : 'ייבא שיר'}
            </button>
          </div>
        )}

        {error && <div style={S.error}>{error}</div>}
      </div>
    </div>
  );
}

const S = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  dialog: {
    background: 'linear-gradient(160deg, #1a1008, #130d06)',
    border: '1px solid rgba(201,165,61,0.25)',
    borderRadius: '16px',
    padding: '2.5rem 2rem',
    width: '420px',
    maxWidth: '90vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
    position: 'relative',
    fontFamily: "'Frank Ruhl Libre', serif",
    direction: 'rtl',
  },
  closeBtn: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    background: 'transparent',
    border: 'none',
    color: 'rgba(212,184,150,0.4)',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '0.25rem',
  },
  icon: { color: 'rgba(201,165,61,0.5)', fontSize: '1.5rem' },
  title: { color: '#e8d5b0', fontSize: '1.3rem', fontWeight: '400' },
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '10px',
    padding: '0.3rem',
    width: '100%',
  },
  tab: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: 'rgba(212,184,150,0.5)',
    padding: '0.5rem',
    borderRadius: '7px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontFamily: "'Frank Ruhl Libre', serif",
    transition: 'all 0.15s',
  },
  tabActive: {
    background: 'rgba(201,165,61,0.12)',
    color: '#c9a53d',
  },
  fileSection: { width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' },
  pasteSection: { width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  hint: {
    color: 'rgba(212,184,150,0.6)',
    fontSize: '0.9rem',
    lineHeight: 1.6,
    margin: 0,
  },
  hintSmall: {
    color: 'rgba(212,184,150,0.4)',
    fontSize: '0.82rem',
  },
  uploadBtn: {
    background: 'rgba(201,165,61,0.1)',
    border: '1px solid rgba(201,165,61,0.35)',
    color: '#c9a53d',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontFamily: "'Frank Ruhl Libre', serif",
    transition: 'all 0.2s',
    width: '100%',
  },
  pasteArea: {
    width: '100%',
    background: 'rgba(212,184,150,0.04)',
    border: '1px solid rgba(201,165,61,0.15)',
    borderRadius: '8px',
    color: '#d4b896',
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '0.95rem',
    lineHeight: 1.7,
    padding: '0.75rem 1rem',
    resize: 'vertical',
    outline: 'none',
  },
  error: {
    color: '#c0392b',
    fontSize: '0.85rem',
    padding: '0.5rem 1rem',
    background: 'rgba(192,57,43,0.1)',
    borderRadius: '6px',
    width: '100%',
    textAlign: 'center',
  },
};
