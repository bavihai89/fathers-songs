import { useState, useEffect } from 'react';

export function useBook() {
  const [book, setBook] = useState({ title: 'שירי פאפו', subtitle: 'אוסף שירים', author: '', coverImage: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/book')
      .then(r => r.json())
      .then(data => { setBook(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateBook = async (updates) => {
    const res = await fetch('/api/book', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const updated = await res.json();
    setBook(updated);
    return updated;
  };

  return { book, loading, updateBook };
}
