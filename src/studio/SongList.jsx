import { useState } from 'react';
import ImportDialog from './ImportDialog';

export default function SongList({ songs, selectedId, onSelect, onNew, onImport }) {
  const [hover, setHover] = useState(null);
  const [showImport, setShowImport] = useState(false);

  async function handleImport(data) {
    setShowImport(false);
    await onImport(data);
  }
  const sorted = [...songs].sort((a, b) => a.order - b.order);
  const finalCount = songs.filter(s => s.status === 'final').length;
  const draftCount = songs.filter(s => s.status === 'draft').length;

  return (
    <div style={S.root}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.headerMeta}>
          <span style={S.headerCount}>{finalCount} סופיים</span>
          {draftCount > 0 && <span style={S.headerDraft}>{draftCount} טיוטות</span>}
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            style={S.newBtn}
            onClick={onNew}
            title="שיר חדש"
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,165,61,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={S.newBtnPlus}>+</span>
            <span>שיר חדש</span>
          </button>
          <button
            style={{ ...S.newBtn, fontSize: '0.78rem' }}
            onClick={() => setShowImport(true)}
            title="ייבוא שיר מקובץ"
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,165,61,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            ⬆ ייבוא
          </button>
        </div>
      </div>

      {/* Divider */}
      <div style={S.divider} />

      {/* List */}
      <div style={S.list}>
        {sorted.map((song, idx) => {
          const isSelected = selectedId === song.id;
          const isHovered = hover === song.id;
          return (
            <button
              key={song.id}
              style={{
                ...S.item,
                ...(isSelected ? S.itemSelected : {}),
                ...(isHovered && !isSelected ? S.itemHover : {}),
              }}
              onClick={() => onSelect(song)}
              onMouseEnter={() => setHover(song.id)}
              onMouseLeave={() => setHover(null)}
            >
              {isSelected && <div style={S.selectedBar} />}
              <div style={S.itemInner}>
                <div style={S.itemTop}>
                  <span style={{ ...S.itemNum, ...(isSelected ? S.itemNumSelected : {}) }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <StatusDot status={song.status} />
                </div>
                <div style={{ ...S.itemTitle, ...(isSelected ? S.itemTitleSelected : {}) }}>
                  {song.title}
                </div>
                {song.dedication && (
                  <div style={S.itemDedication}>{song.dedication.split('\n')[0]}</div>
                )}
              </div>
            </button>
          );
        })}

        {songs.length === 0 && (
          <div style={S.empty}>
            <span style={S.emptyIcon}>✦</span>
            <span>אין שירים עדיין</span>
          </div>
        )}
      </div>

      {showImport && (
        <ImportDialog
          onImport={handleImport}
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  );
}

function StatusDot({ status }) {
  const isFinal = status === 'final';
  return (
    <span style={{
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      flexShrink: 0,
      background: isFinal ? '#c9a53d' : 'rgba(139,69,19,0.6)',
      boxShadow: isFinal ? '0 0 4px rgba(201,165,61,0.5)' : 'none',
    }} title={isFinal ? 'סופי' : 'טיוטה'} />
  );
}

const S = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    fontFamily: "'Heebo', 'Arial Hebrew', sans-serif",
    overflow: 'hidden',
    background: '#1c1409',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.1rem 1.25rem 0.9rem',
    flexShrink: 0,
  },
  headerMeta: { display: 'flex', gap: '0.75rem', alignItems: 'center' },
  headerCount: { color: 'rgba(201,165,61,0.6)', fontSize: '0.78rem', letterSpacing: '0.05em' },
  headerDraft: {
    color: 'rgba(196,122,58,0.6)',
    fontSize: '0.75rem',
    padding: '0.1rem 0.5rem',
    background: 'rgba(139,69,19,0.15)',
    borderRadius: '20px',
  },
  newBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'transparent',
    border: '1px solid rgba(201,165,61,0.3)',
    color: '#c9a53d',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontFamily: "'Heebo', sans-serif",
    fontWeight: '500',
    transition: 'background 0.15s',
  },
  newBtnPlus: { fontSize: '1rem', lineHeight: 1 },
  divider: {
    height: '1px',
    background: 'linear-gradient(to left, transparent, rgba(201,165,61,0.15), transparent)',
    flexShrink: 0,
  },
  list: { flex: 1, overflowY: 'auto', padding: '0.5rem 0' },
  item: {
    position: 'relative',
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(201,165,61,0.06)',
    padding: '0',
    cursor: 'pointer',
    textAlign: 'right',
    transition: 'background 0.15s',
  },
  itemSelected: {
    background: 'rgba(201,165,61,0.07)',
  },
  itemHover: {
    background: 'rgba(212,184,150,0.04)',
  },
  selectedBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '3px',
    background: 'linear-gradient(180deg, #c9a53d, rgba(201,165,61,0.4))',
    borderRadius: '0 2px 2px 0',
  },
  itemInner: {
    padding: '0.85rem 1.25rem 0.85rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  itemTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemNum: {
    color: 'rgba(201,165,61,0.3)',
    fontSize: '0.7rem',
    fontFamily: 'monospace',
    letterSpacing: '0.05em',
  },
  itemNumSelected: { color: 'rgba(201,165,61,0.7)' },
  itemTitle: {
    color: 'rgba(220,195,160,0.75)',
    fontSize: '0.98rem',
    lineHeight: 1.4,
    transition: 'color 0.15s',
    fontFamily: "'Frank Ruhl Libre', serif",
    fontWeight: '400',
  },
  itemTitleSelected: { color: '#ecdbb8' },
  itemDedication: {
    color: 'rgba(200,176,144,0.35)',
    fontSize: '0.76rem',
    fontFamily: "'Heebo', sans-serif",
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '3rem 1rem',
    color: 'rgba(212,184,150,0.25)',
    fontSize: '0.9rem',
  },
  emptyIcon: { fontSize: '1.5rem' },
};
