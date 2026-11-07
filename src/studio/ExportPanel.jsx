import { useState } from 'react';

const C = {
  gold: '#c9a53d',
  brown: '#8b4513',
  muted: '#7a5c3a',
  border: 'rgba(201,165,61,0.2)',
  parchment: '#f5ead6',
  text: '#d4b896',
};

export default function ExportPanel({ songs, book }) {
  const [copied, setCopied] = useState(false);
  const finalCount = songs.filter(s => s.status === 'final').length;

  function handlePrint() {
    window.print();
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={styles.root}>
      <div style={styles.inner}>
        <h2 style={styles.title}>✦ ייצוא הספר</h2>
        <p style={styles.subtitle}>
          {finalCount} שירים סופיים מוכנים לייצוא
        </p>

        <div style={styles.cards}>
          {/* Print / PDF */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>🖨️</div>
            <h3 style={styles.cardTitle}>הדפסה / PDF</h3>
            <p style={styles.cardDesc}>
              הדפס את הספר ישירות מהדפדפן.
              בתיבת ההדפסה בחר "שמור כ-PDF" לקבלת קובץ.
            </p>
            <ul style={styles.tipList}>
              <li>כיוון נייר: אנכי</li>
              <li>שוליים: ברירת מחדל</li>
              <li>הפעל הדפסת רקע לצבעים</li>
            </ul>
            <button style={styles.printBtn} onClick={handlePrint}>
              🖨️ פתח תיבת הדפסה
            </button>
          </div>

          {/* Share */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>📤</div>
            <h3 style={styles.cardTitle}>שיתוף דיגיטלי</h3>
            <p style={styles.cardDesc}>
              שתף את הספר הדיגיטלי עם המשפחה.
              כל מי שמחובר לאותה רשת יוכל לפתוח.
            </p>
            <div style={styles.linkBox}>
              <code style={styles.linkCode}>{window.location.origin}</code>
            </div>
            <button style={styles.copyBtn} onClick={handleCopyLink}>
              {copied ? '✓ הועתק!' : '📋 העתק קישור'}
            </button>
          </div>

          {/* Stats */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>📊</div>
            <h3 style={styles.cardTitle}>סיכום הספר</h3>
            <div style={styles.statsList}>
              <div style={styles.stat}>
                <span style={styles.statNum}>{finalCount}</span>
                <span style={styles.statLabel}>שירים בספר</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNum}>{songs.filter(s => s.status === 'draft').length}</span>
                <span style={styles.statLabel}>טיוטות</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNum}>{songs.filter(s => s.image).length}</span>
                <span style={styles.statLabel}>עם תמונות</span>
              </div>
            </div>
            <div style={styles.bookName}>{book.title}</div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #print-view { display: block !important; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  root: {
    flex: 1,
    overflow: 'auto',
    padding: '2rem',
    fontFamily: "'Frank Ruhl Libre', serif",
  },
  inner: { maxWidth: '800px' },
  title: {
    color: C.gold,
    fontSize: '1.6rem',
    fontWeight: 'normal',
    margin: '0 0 0.5rem',
  },
  subtitle: {
    color: C.muted,
    fontSize: '1rem',
    margin: '0 0 2rem',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '1.25rem',
  },
  card: {
    background: 'rgba(245,234,214,0.04)',
    border: `1px solid ${C.border}`,
    borderRadius: '10px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  cardIcon: { fontSize: '2rem' },
  cardTitle: {
    color: C.gold,
    fontSize: '1.05rem',
    fontWeight: 'normal',
    margin: 0,
  },
  cardDesc: {
    color: C.muted,
    fontSize: '0.9rem',
    lineHeight: 1.6,
    margin: 0,
  },
  tipList: {
    color: C.muted,
    fontSize: '0.85rem',
    paddingRight: '1.25rem',
    margin: 0,
    lineHeight: 1.8,
  },
  printBtn: {
    marginTop: 'auto',
    background: C.gold,
    border: 'none',
    color: '#1a1008',
    padding: '0.65rem 1.25rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontFamily: "'Frank Ruhl Libre', serif",
    fontWeight: 'bold',
  },
  linkBox: {
    background: 'rgba(0,0,0,0.3)',
    border: `1px solid ${C.border}`,
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
  },
  linkCode: {
    color: C.parchment,
    fontSize: '0.85rem',
    fontFamily: 'monospace',
  },
  copyBtn: {
    marginTop: 'auto',
    background: 'transparent',
    border: `1px solid ${C.gold}`,
    color: C.gold,
    padding: '0.65rem 1.25rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontFamily: "'Frank Ruhl Libre', serif",
  },
  statsList: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.25rem',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.2rem',
  },
  statNum: {
    color: C.gold,
    fontSize: '1.8rem',
    lineHeight: 1,
  },
  statLabel: {
    color: C.muted,
    fontSize: '0.75rem',
  },
  bookName: {
    color: 'rgba(245,234,214,0.3)',
    fontSize: '0.85rem',
    textAlign: 'center',
    marginTop: 'auto',
    fontStyle: 'italic',
  },
};
