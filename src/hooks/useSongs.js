import { useState, useEffect, useCallback } from 'react';

export function useSongs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSongs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/songs');
      if (!res.ok) throw new Error('שגיאה בטעינת השירים');
      const data = await res.json();
      setSongs(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSongs(); }, [fetchSongs]);

  const createSong = async (songData = {}) => {
    const res = await fetch('/api/songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(songData),
    });
    const newSong = await res.json();
    setSongs(prev => [...prev, newSong]);
    return newSong;
  };

  const updateSong = async (id, songData) => {
    const res = await fetch(`/api/songs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(songData),
    });
    const updated = await res.json();
    setSongs(prev => prev.map(s => s.id === id ? updated : s));
    return updated;
  };

  const deleteSong = async (id) => {
    await fetch(`/api/songs/${id}`, { method: 'DELETE' });
    setSongs(prev => prev.filter(s => s.id !== id));
  };

  const reorderSongs = async (newOrderIds) => {
    const res = await fetch('/api/songs/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: newOrderIds }),
    });
    const reordered = await res.json();
    setSongs(reordered);
  };

  return { songs, loading, error, createSong, updateSong, deleteSong, reorderSongs, refetch: fetchSongs };
}
