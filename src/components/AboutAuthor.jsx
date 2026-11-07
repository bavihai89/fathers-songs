export default function AboutAuthor({ book, songs, onBack }) {
  const finalCount = songs.filter(s => s.status === 'final').length;
  const bio = book.authorBio || '';
  const authorImage = book.authorImage || null;
  const rawGallery = book.gallery || [];
  const gallery = rawGallery.map(item =>
    typeof item === 'string' ? { path: item, caption: '' } : item
  );

  return (
    <div style={S.wrapper}>
      <div style={S.page}>
        <button style={S.backBtn} onClick={onBack}>← חזרה</button>

        <div style={S.ornament}>✦</div>
        <h2 style={S.heading}>על המחבר</h2>
        <div style={S.divider} />

        <div style={S.portrait}>
          {authorImage
            ? <img src={authorImage} alt={book.author} style={S.photo} />
            : <div style={S.photoPlaceholder}><span style={S.photoGlyph}>◈</span></div>
          }
        </div>

        <h3 style={S.name}>{book.author || 'המחבר'}</h3>

        {bio
          ? <p style={S.bio}>{bio}</p>
          : <p style={S.bioEmpty}>תיאור המחבר יתווסף בקרוב…</p>
        }

        {finalCount > 0 && (
          <div style={S.statRow}>
            <span style={S.stat}>{finalCount} שירים באוסף</span>
          </div>
        )}

        {gallery.length > 0 && (
          <div style={S.gallerySection}>
            <div style={S.galleryDivider} />
            <h4 style={S.galleryTitle}>גלריית זכרונות</h4>
            <div style={S.galleryGrid}>
              {gallery.map((item, i) => (
                <div key={i} style={S.galleryCard}>
                  <img src={item.path} alt={item.caption || ''} style={S.galleryImg} />
                  {item.caption && (
                    <p style={S.galleryCaption}>{item.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={S.bottomOrnament}>
          <span style={S.ornamentLine} />
          <span style={S.ornamentGlyph}>✦</span>
          <span style={S.ornamentLine} />
        </div>
      </div>
    </div>
  );
}

const S = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at center, #2e1a08 0%, #1a1008 70%)',
    padding: '3rem 2rem',
  },
  page: {
    background: 'linear-gradient(160deg, #f5ead6 0%, #ecdcbb 50%, #e8d4a8 100%)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.7), inset 0 0 80px rgba(139,69,19,0.1), 8px 8px 0 #8b4513',
    maxWidth: '540px',
    width: '100%',
    padding: '3rem 2.5rem',
    borderRadius: '2px',
    position: 'relative',
    textAlign: 'center',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#8b4513',
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '0.95rem',
    cursor: 'pointer',
    marginBottom: '1.5rem',
    display: 'block',
    padding: 0,
    textAlign: 'right',
  },
  ornament: {
    color: 'rgba(201,165,61,0.5)',
    fontSize: '1.4rem',
    marginBottom: '0.5rem',
  },
  heading: {
    fontFamily: "'Secular One', 'Arial Hebrew', sans-serif",
    fontSize: '2rem',
    color: '#2c1a0e',
    fontWeight: '400',
    marginBottom: '0.75rem',
    marginTop: 0,
  },
  divider: {
    width: '100%',
    height: '1px',
    background: 'linear-gradient(to right, transparent, #c9a53d, transparent)',
    marginBottom: '2rem',
  },
  portrait: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.25rem',
  },
  photo: {
    width: '130px',
    height: '130px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid rgba(201,165,61,0.4)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  photoPlaceholder: {
    width: '130px',
    height: '130px',
    borderRadius: '50%',
    border: '2px solid rgba(201,165,61,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(139,69,19,0.08)',
  },
  photoGlyph: { color: 'rgba(201,165,61,0.3)', fontSize: '2rem' },
  name: {
    fontFamily: "'Secular One', 'Arial Hebrew', sans-serif",
    fontSize: '1.5rem',
    color: '#2c1a0e',
    fontWeight: '400',
    margin: '0 0 1.25rem',
  },
  bio: {
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '1.05rem',
    lineHeight: '1.9',
    color: '#3d2010',
    textAlign: 'right',
    whiteSpace: 'pre-wrap',
    marginBottom: '1.5rem',
  },
  bioEmpty: {
    fontFamily: "'Frank Ruhl Libre', serif",
    color: 'rgba(44,26,14,0.4)',
    fontStyle: 'italic',
    fontSize: '1rem',
    marginBottom: '1.5rem',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  stat: {
    fontFamily: "'Heebo', sans-serif",
    fontSize: '0.85rem',
    color: 'rgba(44,26,14,0.5)',
    background: 'rgba(201,165,61,0.1)',
    border: '1px solid rgba(201,165,61,0.25)',
    borderRadius: '20px',
    padding: '0.25rem 1rem',
  },
  gallerySection: {
    marginTop: '2rem',
    textAlign: 'center',
  },
  galleryDivider: {
    width: '100%',
    height: '1px',
    background: 'linear-gradient(to right, transparent, rgba(201,165,61,0.35), transparent)',
    marginBottom: '1.5rem',
  },
  galleryTitle: {
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '1rem',
    color: 'rgba(44,26,14,0.5)',
    fontWeight: 'normal',
    letterSpacing: '0.08em',
    marginBottom: '1rem',
    marginTop: 0,
  },
  galleryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
    textAlign: 'right',
  },
  galleryCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  galleryImg: {
    width: '100%',
    aspectRatio: '4/3',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid rgba(201,165,61,0.25)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
    display: 'block',
  },
  galleryCaption: {
    fontFamily: "'Frank Ruhl Libre', serif",
    fontSize: '0.82rem',
    color: 'rgba(44,26,14,0.55)',
    fontStyle: 'italic',
    lineHeight: 1.5,
    margin: 0,
  },
  bottomOrnament: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: '0.5rem',
  },
  ornamentLine: { flex: 1, height: '1px', background: 'rgba(139,69,19,0.3)' },
  ornamentGlyph: { color: '#c9a53d', fontSize: '0.85rem', flexShrink: 0 },
};
