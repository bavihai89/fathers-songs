import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const C = {
  gold: '#c9a53d',
  brown: '#8b4513',
  muted: '#7a5c3a',
  border: 'rgba(201,165,61,0.2)',
  parchment: '#f5ead6',
  text: '#d4b896',
  bg: '#1a1008',
  inputBg: 'rgba(245,234,214,0.06)',
  inputBorder: 'rgba(201,165,61,0.3)',
};

export default function BookEditor({ songs, book, onUpdateBook, onReorderSongs, onUpdateSong }) {
  const finalSongs = [...songs].filter(s => s.status === 'final').sort((a, b) => a.order - b.order);
  const [bookForm, setBookForm] = useState({
    title: book.title,
    subtitle: book.subtitle,
    author: book.author,
    authorBio: book.authorBio || '',
  });
  const [bookSaved, setBookSaved] = useState(false);
  const [items, setItems] = useState(finalSongs.map(s => s.id));
  // normalize: old format was string[], new format is {path, caption}[]
  const normalizeGallery = (raw) => (raw || []).map(item =>
    typeof item === 'string' ? { path: item, caption: '' } : item
  );
  const [gallery, setGallery] = useState(normalizeGallery(book.gallery));
  const [galleryUploading, setGalleryUploading] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  async function handleBookSave() {
    await onUpdateBook(bookForm);
    setBookSaved(true);
    setTimeout(() => setBookSaved(false), 1500);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.indexOf(active.id);
    const newIndex = items.indexOf(over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    onReorderSongs(newItems);
  }

  async function handleCoverUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch('/api/images/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.path) {
      await onUpdateBook({ ...bookForm, coverImage: data.path });
    }
  }

  async function handleGalleryUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setGalleryUploading(true);
    try {
      const newItems = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('image', file);
        const res = await fetch('/api/images/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.path) newItems.push({ path: data.path, caption: '' });
      }
      const updated = [...gallery, ...newItems];
      setGallery(updated);
      await onUpdateBook({ ...bookForm, gallery: updated });
    } finally {
      setGalleryUploading(false);
    }
  }

  async function handleRemoveGalleryPhoto(idx) {
    const updated = gallery.filter((_, i) => i !== idx);
    setGallery(updated);
    await onUpdateBook({ ...bookForm, gallery: updated });
  }

  function handleCaptionChange(idx, caption) {
    const updated = gallery.map((item, i) => i === idx ? { ...item, caption } : item);
    setGallery(updated);
  }

  async function handleCaptionBlur(idx) {
    await onUpdateBook({ ...bookForm, gallery });
  }

  const orderedSongs = items.map(id => songs.find(s => s.id === id)).filter(Boolean);

  return (
    <div style={styles.root}>
      <div style={styles.columns}>
        {/* Book Metadata */}

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>פרטי הספר</h3>

          <div style={styles.field}>
            <label style={styles.label}>שם הספר</label>
            <input
              style={styles.input}
              value={bookForm.title}
              onChange={e => setBookForm(p => ({ ...p, title: e.target.value }))}
              dir="rtl"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>כותרת משנה</label>
            <input
              style={styles.input}
              value={bookForm.subtitle}
              onChange={e => setBookForm(p => ({ ...p, subtitle: e.target.value }))}
              dir="rtl"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>מחבר</label>
            <input
              style={styles.input}
              value={bookForm.author}
              onChange={e => setBookForm(p => ({ ...p, author: e.target.value }))}
              dir="rtl"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>אודות המחבר</label>
            <textarea
              style={{ ...styles.input, minHeight: '80px', resize: 'vertical', lineHeight: '1.6' }}
              value={bookForm.authorBio}
              onChange={e => setBookForm(p => ({ ...p, authorBio: e.target.value }))}
              placeholder="כמה מילים על המחבר שיופיעו בספר…"
              dir="rtl"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>תמונת שער</label>
            <label style={styles.uploadLabel}>
              📁 החלף תמונת שער
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverUpload} />
            </label>
          </div>

          <div style={styles.fieldActions}>
            {bookSaved && <span style={styles.savedMsg}>✓ נשמר</span>}
            <button style={styles.saveBtn} onClick={handleBookSave}>שמור פרטים</button>
          </div>
        </div>

        {/* Song Order */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            סדר השירים
            <span style={styles.cardSubtitle}> — גרור לשינוי סדר</span>
          </h3>

          {finalSongs.length === 0 ? (
            <p style={styles.emptyNote}>אין שירים סופיים עדיין. סמן שירים כ"סופי" כדי שיופיעו בספר.</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <div style={styles.sortableList}>
                  {orderedSongs.map((song, idx) => (
                    <SortableItem key={song.id} song={song} index={idx + 1} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {songs.filter(s => s.status === 'draft').length > 0 && (
            <p style={styles.draftNote}>
              {songs.filter(s => s.status === 'draft').length} טיוטות לא מופיעות בספר
            </p>
          )}
        </div>
      </div>

      {/* Gallery */}
      <div style={{ ...styles.card, marginTop: '1.5rem', maxWidth: '900px' }}>
        <div style={styles.galleryHeader}>
          <h3 style={styles.cardTitle}>גלריית זכרונות</h3>
          <label style={styles.uploadLabel}>
            {galleryUploading ? '…מעלה' : '+ הוסף תמונות'}
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleGalleryUpload}
              disabled={galleryUploading}
            />
          </label>
        </div>
        <p style={styles.galleryHint}>תמונות שמלוות את הספר והזכרונות שלו</p>
        {gallery.length === 0 ? (
          <p style={styles.emptyNote}>לא הועלו תמונות עדיין</p>
        ) : (
          <div style={styles.galleryGrid}>
            {gallery.map((item, i) => (
              <div key={i} style={styles.galleryItem}>
                <img src={item.path} alt="" style={styles.galleryImg} />
                <button
                  style={styles.removePhotoBtn}
                  onClick={() => handleRemoveGalleryPhoto(i)}
                  title="הסר תמונה"
                >✕</button>
                <input
                  style={styles.captionInput}
                  value={item.caption}
                  onChange={e => handleCaptionChange(i, e.target.value)}
                  onBlur={() => handleCaptionBlur(i)}
                  placeholder="כיתוב / זכרון…"
                  dir="rtl"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SortableItem({ song, index }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: song.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        ...styles.sortItem,
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        background: isDragging ? 'rgba(201,165,61,0.1)' : 'transparent',
      }}
    >
      <span {...attributes} {...listeners} style={styles.dragHandle} title="גרור">⠿</span>
      <span style={styles.sortNum}>{index}</span>
      <span style={styles.sortTitle}>{song.title}</span>
      {song.image && <span style={styles.hasImage} title="יש תמונה">🖼️</span>}
    </div>
  );
}

const styles = {
  root: {
    flex: 1,
    overflow: 'auto',
    padding: '1.5rem',
    fontFamily: "'Frank Ruhl Libre', serif",
  },
  columns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    maxWidth: '900px',
  },
  card: {
    background: 'rgba(245,234,214,0.04)',
    border: `1px solid ${C.border}`,
    borderRadius: '10px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  cardTitle: {
    color: C.gold,
    fontSize: '1.1rem',
    fontWeight: 'normal',
    margin: 0,
  },
  cardSubtitle: {
    color: C.muted,
    fontSize: '0.85rem',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { color: C.muted, fontSize: '0.85rem' },
  input: {
    background: C.inputBg,
    border: `1px solid ${C.inputBorder}`,
    borderRadius: '6px',
    padding: '0.6rem 0.9rem',
    color: C.parchment,
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '1rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  uploadLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'transparent',
    border: `1px solid ${C.border}`,
    color: C.muted,
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  fieldActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: '0.25rem',
  },
  savedMsg: { color: C.gold, fontSize: '0.85rem' },
  saveBtn: {
    background: C.gold,
    border: 'none',
    color: '#1a1008',
    padding: '0.5rem 1.25rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontFamily: "'Frank Ruhl Libre', serif",
    fontWeight: 'bold',
  },
  emptyNote: { color: C.muted, fontSize: '0.95rem', textAlign: 'center', padding: '1rem 0' },
  sortableList: { display: 'flex', flexDirection: 'column', gap: '0' },
  sortItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.7rem 0.5rem',
    borderBottom: `1px solid ${C.border}`,
    borderRadius: '4px',
    cursor: 'default',
  },
  dragHandle: {
    color: C.muted,
    cursor: 'grab',
    fontSize: '1.1rem',
    userSelect: 'none',
    padding: '0 0.25rem',
  },
  sortNum: {
    color: C.gold,
    fontSize: '0.85rem',
    minWidth: '1.5rem',
    textAlign: 'center',
  },
  sortTitle: {
    color: C.text,
    fontSize: '1rem',
    flex: 1,
  },
  hasImage: { fontSize: '0.9rem' },
  draftNote: {
    color: C.muted,
    fontSize: '0.8rem',
    textAlign: 'center',
    marginTop: '0.5rem',
    padding: '0.5rem',
    background: 'rgba(139,69,19,0.1)',
    borderRadius: '4px',
  },
  galleryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  galleryHint: {
    color: C.muted,
    fontSize: '0.85rem',
    margin: '-0.5rem 0 0',
  },
  galleryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '1rem',
  },
  galleryItem: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    border: `1px solid ${C.border}`,
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(245,234,214,0.04)',
  },
  galleryImg: {
    width: '100%',
    aspectRatio: '4/3',
    objectFit: 'cover',
    display: 'block',
  },
  removePhotoBtn: {
    position: 'absolute',
    top: '6px',
    left: '6px',
    background: 'rgba(0,0,0,0.65)',
    border: 'none',
    color: '#fff',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '0.7rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  captionInput: {
    background: 'transparent',
    border: 'none',
    borderTop: `1px solid ${C.border}`,
    padding: '0.5rem 0.6rem',
    color: C.text,
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '0.82rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    lineHeight: 1.5,
  },
};
