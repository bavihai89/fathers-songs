import { useState, useEffect, useRef } from 'react';
import ImageGenerator from './ImageGenerator';
import VoiceRecorder from './VoiceRecorder';

export default function SongEditor({ song, onSave, onDelete }) {
  const [title, setTitle] = useState(song.title || '');
  const [dedication, setDedication] = useState(song.dedication || '');
  const [lyrics, setLyrics] = useState(song.lyrics || '');
  const [notes, setNotes] = useState(song.notes || '');
  const [story, setStory] = useState(song.story || '');
  const [writtenAt, setWrittenAt] = useState(song.writtenAt || '');
  const [status, setStatus] = useState(song.status || 'draft');
  const [image, setImage] = useState(song.image || null);
  const [audioPath, setAudioPath] = useState(song.audioPath || null);
  const [lyricsNikud, setLyricsNikud] = useState(song.lyricsNikud || '');
  const [nikudLoading, setNikudLoading] = useState(false);
  const [nikudError, setNikudError] = useState('');
  const [showNikud, setShowNikud] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImageGen, setShowImageGen] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const debounceRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setTitle(song.title || '');
    setDedication(song.dedication || '');
    setLyrics(song.lyrics || '');
    setNotes(song.notes || '');
    setStory(song.story || '');
    setWrittenAt(song.writtenAt || '');
    setStatus(song.status || 'draft');
    setImage(song.image || null);
    setAudioPath(song.audioPath || null);
    setLyricsNikud(song.lyricsNikud || '');
    setShowNikud(false);
    setNikudError('');
  }, [song.id]);

  function triggerAutoSave(overrides = {}) {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const data = { title, dedication, lyrics, notes, story, writtenAt, status, image, audioPath, lyricsNikud, ...overrides };
      onSave(song.id, data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1200);
  }

  async function handleGenerateNikud() {
    if (!lyrics.trim()) return;
    setNikudLoading(true);
    setNikudError('');
    try {
      const res = await fetch('/api/nikud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: lyrics }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLyricsNikud(data.nikud);
      setShowNikud(true);
      triggerAutoSave({ lyricsNikud: data.nikud });
    } catch (e) {
      setNikudError('שגיאה: ' + e.message);
    } finally {
      setNikudLoading(false);
    }
  }

  function handleChange(setter, field) {
    return (e) => {
      setter(e.target.value);
      triggerAutoSave({ [field]: e.target.value });
    };
  }

  async function handleAddToBook() {
    const next = status === 'final' ? 'draft' : 'final';
    setStatus(next);
    clearTimeout(debounceRef.current);
    setSaving(true);
    await onSave(song.id, { title, dedication, lyrics, notes, story, writtenAt, image, audioPath, lyricsNikud, status: next });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleManualSave() {
    clearTimeout(debounceRef.current);
    setSaving(true);
    await onSave(song.id, { title, dedication, lyrics, notes, story, writtenAt, status, image, audioPath, lyricsNikud });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadError('');
    const form = new FormData();
    form.append('image', file);
    try {
      const res = await fetch('/api/images/upload', { method: 'POST', body: form });
      const data = await res.json();
      setImage(data.path);
      triggerAutoSave({ image: data.path });
    } catch {
      setUploadError('שגיאה בהעלאת התמונה');
    }
  }

  function handleImageGenerated(path) {
    setImage(path);
    setShowImageGen(false);
    triggerAutoSave({ image: path });
  }

  function handleAudioSaved(path) {
    setAudioPath(path);
    triggerAutoSave({ audioPath: path });
  }

  function handleRemoveAudio() {
    setAudioPath(null);
    triggerAutoSave({ audioPath: null });
  }

  const isFinal = status === 'final';

  return (
    <div style={S.root}>
      {/* Top bar */}
      <div style={S.topBar}>
        <div style={S.topLeft}>
          <BookToggleBtn isFinal={isFinal} saving={saving} saved={saved} onToggle={handleAddToBook} />
        </div>
        <div style={S.topRight}>
          <button style={S.saveBtn} onClick={handleManualSave} disabled={saving}>
            {saving ? 'שומר…' : saved ? '✓ נשמר' : 'שמור'}
          </button>
          <button style={S.deleteBtn} onClick={() => setShowDeleteConfirm(true)}>מחק</button>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={S.scroll}>

        {/* Parchment editing surface */}
        <div style={S.parchment}>
          <input
            style={S.titleInput}
            value={title}
            onChange={handleChange(setTitle, 'title')}
            placeholder="שם השיר"
            dir="rtl"
          />
          <div style={S.ornamentRow}>
            <span style={S.ornamentLine} />
            <span style={S.ornamentGlyph}>✦</span>
            <span style={S.ornamentLine} />
          </div>
          <input
            style={S.dedicationInput}
            value={dedication}
            onChange={handleChange(setDedication, 'dedication')}
            placeholder="הקדשה (רשות)"
            dir="rtl"
          />
          <textarea
            style={S.lyricsArea}
            value={lyrics}
            onChange={handleChange(setLyrics, 'lyrics')}
            placeholder="כתוב את השיר כאן…"
            dir="rtl"
          />

          {/* Nikud section */}
          <div style={S.nikudBar}>
            <button
              style={S.nikudBtn}
              onClick={handleGenerateNikud}
              disabled={nikudLoading || !lyrics.trim()}
              title="יוצר ניקוד אוטומטי בעזרת בינה מלאכותית"
            >
              {nikudLoading ? '…מנקד' : lyricsNikud ? '✦ עדכן ניקוד' : '✦ הוסף ניקוד'}
            </button>
            {lyricsNikud && (
              <button
                style={{ ...S.nikudToggle, ...(showNikud ? S.nikudToggleActive : {}) }}
                onClick={() => setShowNikud(v => !v)}
              >
                {showNikud ? 'הסתר ניקוד' : 'הצג ניקוד'}
              </button>
            )}
            {nikudError && <span style={S.nikudError}>{nikudError}</span>}
          </div>

          {showNikud && lyricsNikud && (
            <div style={S.nikudBlock}>
              <div style={S.nikudBlockLabel}>גרסה מנוקדת — ניתן לתיקון ידני</div>
              <textarea
                style={S.nikudArea}
                value={lyricsNikud}
                onChange={e => { setLyricsNikud(e.target.value); triggerAutoSave({ lyricsNikud: e.target.value }); }}
                dir="rtl"
              />
            </div>
          )}
        </div>

        {/* Meta fields — date + story */}
        <div style={S.metaSection}>
          <div style={S.metaRow}>
            <label style={S.metaLabel}>מתי נכתב</label>
            <input
              style={S.metaInput}
              type="text"
              value={writtenAt}
              onChange={handleChange(setWrittenAt, 'writtenAt')}
              placeholder="לדוגמה: קיץ 1998, יום הולדת 60 של רחל…"
              dir="rtl"
            />
          </div>
          <div style={S.metaRow}>
            <label style={S.metaLabel}>הסיפור מאחורי השיר</label>
            <textarea
              style={S.storyArea}
              value={story}
              onChange={handleChange(setStory, 'story')}
              placeholder="מה קרה? מי היה שם? מה הרגשת? אלו הדברים שחשוב לזכור…"
              dir="rtl"
            />
          </div>
        </div>

        {/* Voice recording */}
        <VoiceRecorder
          audioPath={audioPath}
          onSaved={handleAudioSaved}
          onRemove={handleRemoveAudio}
          songId={song.id}
        />

        {/* Image section */}
        <div style={S.imageSection}>
          <div style={S.imageSectionHeader}>
            <span style={S.sectionTitle}>תמונה מלווה</span>
            <div style={S.imageActions}>
              <button style={S.imgBtn} onClick={() => fileInputRef.current?.click()}>העלה</button>
              <button style={S.imgBtn} onClick={() => setShowImageGen(true)}>✦ צור בינה מלאכותית</button>
              {image && (
                <button style={{ ...S.imgBtn, ...S.imgBtnDanger }} onClick={() => { setImage(null); triggerAutoSave({ image: null }); }}>
                  הסר
                </button>
              )}
            </div>
          </div>
          {uploadError && <div style={S.uploadError}>{uploadError}</div>}
          {image
            ? <div style={S.imagePreviewWrap}><img src={image} alt="תמונה מלווה" style={S.imagePreview} /></div>
            : <div style={S.imagePlaceholder}><span style={S.imagePlaceholderIcon}>◇</span><span>אין תמונה עדיין</span></div>
          }
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
        </div>

        {/* Notes */}
        <div style={S.notesSection}>
          <div style={S.notesSectionLabel}>הערות פרטיות</div>
          <textarea
            style={S.notesArea}
            value={notes}
            onChange={handleChange(setNotes, 'notes')}
            placeholder="הערות שלא יופיעו בספר…"
            dir="rtl"
          />
        </div>
      </div>

      {/* Delete confirmation overlay */}
      {showDeleteConfirm && (
        <div style={S.overlay}>
          <div style={S.dialog}>
            <div style={S.dialogIcon}>✦</div>
            <div style={S.dialogTitle}>מחיקת השיר</div>
            <div style={S.dialogText}>האם למחוק את "{title}"? פעולה זו אינה הפיכה.</div>
            <div style={S.dialogActions}>
              <button style={S.dialogCancel} onClick={() => setShowDeleteConfirm(false)}>ביטול</button>
              <button style={S.dialogConfirm} onClick={() => onDelete(song.id)}>מחק</button>
            </div>
          </div>
        </div>
      )}

      {showImageGen && (
        <ImageGenerator
          songTitle={title}
          lyrics={lyrics}
          onGenerated={handleImageGenerated}
          onClose={() => setShowImageGen(false)}
        />
      )}
    </div>
  );
}

function BookToggleBtn({ isFinal, saving, saved, onToggle }) {
  if (isFinal) {
    return (
      <button style={S.inBookBtn} onClick={onToggle} disabled={saving}>
        <span style={S.inBookDot} />
        <span>בספר</span>
        <span style={S.inBookRemove}>הסר</span>
      </button>
    );
  }
  return (
    <button style={S.addToBookBtn} onClick={onToggle} disabled={saving}>
      <span>+ הוסף לספר</span>
    </button>
  );
}

const S = {
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: '#231810',
    fontFamily: "'Heebo', 'Arial Hebrew', sans-serif",
    direction: 'rtl',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    borderBottom: '1px solid rgba(201,165,61,0.08)',
    flexShrink: 0,
    background: '#1c1409',
  },
  topLeft: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  topRight: { display: 'flex', gap: '0.5rem' },
  addToBookBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.42rem 1.2rem',
    borderRadius: '20px',
    border: '1px solid rgba(201,165,61,0.5)',
    background: 'rgba(201,165,61,0.08)',
    color: '#c9a53d',
    cursor: 'pointer',
    fontSize: '0.86rem',
    fontFamily: "'Heebo', sans-serif",
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  inBookBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.38rem 0.9rem',
    borderRadius: '20px',
    border: '1px solid rgba(124,186,124,0.4)',
    background: 'rgba(124,186,124,0.1)',
    color: '#7cba7c',
    cursor: 'pointer',
    fontSize: '0.83rem',
    fontFamily: "'Heebo', sans-serif",
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  inBookDot: {
    width: '7px', height: '7px', borderRadius: '50%',
    background: '#7cba7c', boxShadow: '0 0 5px rgba(124,186,124,0.6)',
  },
  inBookRemove: {
    fontSize: '0.75rem',
    color: 'rgba(124,186,124,0.5)',
    marginRight: '0.1rem',
    paddingRight: '0.5rem',
    borderRight: '1px solid rgba(124,186,124,0.25)',
  },
  saveBtn: {
    background: 'rgba(201,165,61,0.1)',
    border: '1px solid rgba(201,165,61,0.35)',
    color: '#c9a53d',
    padding: '0.4rem 1.1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.86rem',
    fontFamily: "'Heebo', sans-serif",
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  deleteBtn: {
    background: 'transparent',
    border: '1px solid rgba(180,60,40,0.2)',
    color: 'rgba(180,60,40,0.5)',
    padding: '0.4rem 0.9rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.83rem',
    fontFamily: "'Heebo', sans-serif",
    transition: 'all 0.2s',
  },
  scroll: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 0 2rem',
  },
  parchment: {
    margin: '1.5rem 1.5rem 0',
    background: 'linear-gradient(160deg, #f5ead6 0%, #f0e2c8 100%)',
    borderRadius: '12px',
    padding: '2.5rem 2.5rem 2rem',
    boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
    border: '1px solid rgba(201,165,61,0.3)',
  },
  titleInput: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '1.9rem',
    fontWeight: '700',
    color: '#2c1a0e',
    textAlign: 'center',
    padding: '0',
    letterSpacing: '0.03em',
  },
  ornamentRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    margin: '1rem 0',
  },
  ornamentLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(139,69,19,0.3)',
  },
  ornamentGlyph: { color: '#c9a53d', fontSize: '0.85rem', flexShrink: 0 },
  dedicationInput: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '1rem',
    fontStyle: 'italic',
    color: '#7a5c3a',
    textAlign: 'center',
    padding: '0 0 1.25rem',
    letterSpacing: '0.02em',
  },
  lyricsArea: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '1.15rem',
    lineHeight: '2.1',
    color: '#2c1a0e',
    textAlign: 'center',
    resize: 'vertical',
    minHeight: '220px',
    padding: '0',
    letterSpacing: '0.01em',
  },
  nikudBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginTop: '1rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid rgba(139,69,19,0.15)',
    flexWrap: 'wrap',
  },
  nikudBtn: {
    background: 'rgba(201,165,61,0.12)',
    border: '1px solid rgba(201,165,61,0.35)',
    borderRadius: '20px',
    color: '#8b6914',
    fontFamily: "'Heebo', sans-serif",
    fontSize: '0.82rem',
    fontWeight: '600',
    padding: '0.32rem 0.9rem',
    cursor: 'pointer',
    letterSpacing: '0.03em',
    transition: 'all 0.15s',
  },
  nikudToggle: {
    background: 'transparent',
    border: '1px solid rgba(139,69,19,0.2)',
    borderRadius: '20px',
    color: 'rgba(44,26,14,0.5)',
    fontFamily: "'Heebo', sans-serif",
    fontSize: '0.78rem',
    padding: '0.28rem 0.75rem',
    cursor: 'pointer',
  },
  nikudToggleActive: {
    background: 'rgba(139,69,19,0.08)',
    color: 'rgba(44,26,14,0.75)',
    borderColor: 'rgba(139,69,19,0.3)',
  },
  nikudError: {
    color: '#c0392b',
    fontSize: '0.78rem',
    fontFamily: "'Heebo', sans-serif",
  },
  nikudBlock: {
    marginTop: '0.75rem',
    background: 'rgba(255,252,240,0.6)',
    border: '1px solid rgba(201,165,61,0.2)',
    borderRadius: '8px',
    padding: '1rem',
  },
  nikudBlockLabel: {
    color: 'rgba(44,26,14,0.4)',
    fontSize: '0.72rem',
    fontFamily: "'Heebo', sans-serif",
    marginBottom: '0.5rem',
    letterSpacing: '0.04em',
  },
  nikudArea: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '1.2rem',
    lineHeight: '2.3',
    color: '#2c1a0e',
    textAlign: 'center',
    resize: 'vertical',
    minHeight: '160px',
    padding: '0',
    letterSpacing: '0.01em',
    direction: 'rtl',
  },
  metaSection: {
    margin: '1.25rem 1.5rem 0',
    background: 'rgba(201,165,61,0.03)',
    border: '1px solid rgba(201,165,61,0.1)',
    borderRadius: '10px',
    padding: '1.1rem 1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.9rem',
  },
  metaRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  metaLabel: {
    color: 'rgba(201,165,61,0.55)',
    fontSize: '0.72rem',
    fontFamily: "'Heebo', sans-serif",
    fontWeight: '600',
    letterSpacing: '0.07em',
    textTransform: 'none',
  },
  metaInput: {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(201,165,61,0.15)',
    outline: 'none',
    color: 'rgba(220,195,160,0.8)',
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '0.95rem',
    padding: '0.3rem 0',
    width: '100%',
    direction: 'rtl',
  },
  storyArea: {
    width: '100%',
    background: 'rgba(200,176,144,0.03)',
    border: '1px solid rgba(201,165,61,0.1)',
    borderRadius: '8px',
    color: 'rgba(220,195,160,0.75)',
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '0.95rem',
    lineHeight: '1.75',
    padding: '0.75rem 1rem',
    resize: 'vertical',
    minHeight: '90px',
    outline: 'none',
    direction: 'rtl',
  },
  sectionTitle: {
    color: 'rgba(201,165,61,0.6)',
    fontSize: '0.76rem',
    fontFamily: "'Heebo', sans-serif",
    fontWeight: '600',
    letterSpacing: '0.07em',
  },
  imageSection: {
    margin: '1rem 1.5rem 0',
    background: 'rgba(201,165,61,0.04)',
    border: '1px solid rgba(201,165,61,0.1)',
    borderRadius: '10px',
    padding: '1rem 1.25rem',
  },
  imageSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  imageActions: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  imgBtn: {
    background: 'transparent',
    border: '1px solid rgba(201,165,61,0.2)',
    color: 'rgba(201,165,61,0.7)',
    padding: '0.3rem 0.75rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.78rem',
    fontFamily: "'Heebo', sans-serif",
    fontWeight: '500',
    transition: 'all 0.15s',
  },
  imgBtnDanger: { borderColor: 'rgba(180,60,40,0.3)', color: 'rgba(180,60,40,0.6)' },
  uploadError: { color: '#c0392b', fontSize: '0.85rem', marginBottom: '0.5rem' },
  imagePreviewWrap: { borderRadius: '8px', overflow: 'hidden', maxHeight: '180px' },
  imagePreview: { width: '100%', height: '180px', objectFit: 'cover', display: 'block' },
  imagePlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '1.5rem 0',
    color: 'rgba(201,165,61,0.2)',
    fontSize: '0.85rem',
  },
  imagePlaceholderIcon: { fontSize: '1.5rem' },
  notesSection: {
    margin: '1rem 1.5rem 0',
  },
  notesSectionLabel: {
    color: 'rgba(200,176,144,0.35)',
    fontSize: '0.73rem',
    fontFamily: "'Heebo', sans-serif",
    fontWeight: '500',
    letterSpacing: '0.06em',
    marginBottom: '0.5rem',
  },
  notesArea: {
    width: '100%',
    background: 'rgba(200,176,144,0.03)',
    border: '1px solid rgba(201,165,61,0.07)',
    borderRadius: '8px',
    color: 'rgba(200,176,144,0.4)',
    fontFamily: "'Heebo', sans-serif",
    fontSize: '0.88rem',
    lineHeight: '1.65',
    padding: '0.75rem 1rem',
    resize: 'vertical',
    minHeight: '70px',
    outline: 'none',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  dialog: {
    background: 'linear-gradient(160deg, #1a1008, #130d06)',
    border: '1px solid rgba(201,165,61,0.25)',
    borderRadius: '16px',
    padding: '2.5rem 2rem',
    width: '340px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
  },
  dialogIcon: { color: 'rgba(201,165,61,0.4)', fontSize: '1.75rem', marginBottom: '0.25rem' },
  dialogTitle: { color: '#e8d5b0', fontSize: '1.2rem', fontFamily: "'Frank Ruhl Libre', serif" },
  dialogText: { color: 'rgba(212,184,150,0.6)', fontSize: '0.9rem', lineHeight: 1.5 },
  dialogActions: { display: 'flex', gap: '0.75rem', marginTop: '0.75rem' },
  dialogCancel: {
    background: 'transparent',
    border: '1px solid rgba(201,165,61,0.2)',
    color: 'rgba(212,184,150,0.6)',
    padding: '0.6rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: "'Heebo', sans-serif",
    fontWeight: '500',
    fontSize: '0.9rem',
  },
  dialogConfirm: {
    background: 'rgba(180,60,40,0.15)',
    border: '1px solid rgba(180,60,40,0.4)',
    color: 'rgba(220,80,60,0.9)',
    padding: '0.6rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: "'Heebo', sans-serif",
    fontWeight: '500',
    fontSize: '0.9rem',
  },
};
