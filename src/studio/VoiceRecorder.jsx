import { useState, useRef, useEffect } from 'react';

export default function VoiceRecorder({ audioPath, onSaved, onRemove, songId }) {
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [duration, setDuration] = useState(0);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => () => {
    clearInterval(timerRef.current);
    mediaRef.current?.stream?.getTracks().forEach(t => t.stop());
  }, []);

  async function startRecording() {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => handleUpload(stream);
      mr.start();
      mediaRef.current = { mr, stream };
      setRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } catch {
      setError('לא ניתן לגשת למיקרופון');
    }
  }

  function stopRecording() {
    clearInterval(timerRef.current);
    mediaRef.current?.mr.stop();
    setRecording(false);
  }

  async function handleUpload(stream) {
    stream.getTracks().forEach(t => t.stop());
    setUploading(true);
    try {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const form = new FormData();
      form.append('audio', blob, `voice-${songId}-${Date.now()}.webm`);
      const res = await fetch('/api/audio/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (data.path) onSaved(data.path);
      else throw new Error(data.error || 'שגיאה');
    } catch (e) {
      setError('שגיאה בהעלאת ההקלטה: ' + e.message);
    } finally {
      setUploading(false);
    }
  }

  function formatTime(s) {
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }

  return (
    <div style={S.root}>
      <div style={S.header}>
        <span style={S.label}>הקלטה קולית</span>
        {audioPath && !recording && (
          <button style={S.removeBtn} onClick={onRemove}>הסר</button>
        )}
      </div>

      {audioPath && !recording ? (
        <div style={S.playerWrap}>
          <audio controls src={audioPath} style={S.player} />
          <button style={S.rerecordBtn} onClick={startRecording}>הקלט מחדש</button>
        </div>
      ) : (
        <div style={S.controls}>
          {recording ? (
            <>
              <div style={S.recIndicator}>
                <span style={S.recDot} />
                <span style={S.recTime}>{formatTime(duration)}</span>
              </div>
              <button style={S.stopBtn} onClick={stopRecording}>⏹ עצור</button>
            </>
          ) : (
            <button style={S.recBtn} onClick={startRecording} disabled={uploading}>
              {uploading ? 'שומר…' : '🎙 הקלט'}
            </button>
          )}
        </div>
      )}

      {error && <div style={S.error}>{error}</div>}
    </div>
  );
}

const S = {
  root: {
    margin: '1rem 1.5rem 0',
    background: 'rgba(201,165,61,0.03)',
    border: '1px solid rgba(201,165,61,0.09)',
    borderRadius: '10px',
    padding: '0.9rem 1.25rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.6rem',
  },
  label: {
    color: 'rgba(201,165,61,0.55)',
    fontSize: '0.72rem',
    fontFamily: "'Heebo', sans-serif",
    fontWeight: '600',
    letterSpacing: '0.07em',
  },
  removeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(180,60,40,0.5)',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontFamily: "'Heebo', sans-serif",
    padding: '0',
  },
  playerWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  player: {
    flex: 1,
    minWidth: '200px',
    height: '32px',
    filter: 'invert(0.85) sepia(0.3) saturate(0.5)',
    opacity: 0.75,
  },
  rerecordBtn: {
    background: 'transparent',
    border: '1px solid rgba(201,165,61,0.2)',
    color: 'rgba(201,165,61,0.5)',
    padding: '0.28rem 0.75rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontFamily: "'Heebo', sans-serif",
    whiteSpace: 'nowrap',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  recBtn: {
    background: 'rgba(180,40,40,0.1)',
    border: '1px solid rgba(180,40,40,0.3)',
    color: 'rgba(220,100,80,0.8)',
    padding: '0.42rem 1.1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontFamily: "'Heebo', sans-serif",
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  recIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  recDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#e05050',
    boxShadow: '0 0 6px rgba(220,80,80,0.7)',
    animation: 'pulse 1s infinite',
  },
  recTime: {
    color: '#e8d5b0',
    fontFamily: 'monospace',
    fontSize: '1rem',
    letterSpacing: '0.08em',
  },
  stopBtn: {
    background: 'rgba(201,165,61,0.1)',
    border: '1px solid rgba(201,165,61,0.3)',
    color: '#c9a53d',
    padding: '0.42rem 1.1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontFamily: "'Heebo', sans-serif",
    fontWeight: '500',
  },
  error: {
    marginTop: '0.4rem',
    color: '#c0392b',
    fontSize: '0.8rem',
    fontFamily: "'Heebo', sans-serif",
  },
};
