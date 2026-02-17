import { useEffect, useState } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/guestbook';

function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchEntries = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setEntries(data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ name: '', message: '' });
        setEditingId(null);
        fetchEntries();
      }
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchEntries();
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setForm({ name: entry.name, message: entry.message });
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📝 My Profile & Guestbook</h1>
        <p>Leave a message for me! 🎀</p>
      </header>

      <main className="main">
        <form onSubmit={handleSubmit} className="guestbook-form">
          <h2>{editingId ? 'Edit Message' : 'Sign the Guestbook'}</h2>
          
          <div className="form-group">
            <label>Your Name:</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Your Message:</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              placeholder="Write your message here..."
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingId ? 'Update' : 'Sign Guestbook'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: '', message: '' });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <section className="entries-section">
          <h2>Messages ({entries.length})</h2>
          
          {entries.length === 0 ? (
            <p className="no-messages">No messages yet. Be the first! 🍄</p>
          ) : (
            <div className="entries-grid">
              {entries.map((entry) => (
                <div key={entry.id} className="entry-card">
                  <div className="entry-header">
                    <strong>{entry.name}</strong>
                    <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                  </div>
                  <p>{entry.message}</p>
                  <div className="entry-actions">
                    <button onClick={() => startEdit(entry)}>Edit</button>
                    <button onClick={() => handleDelete(entry.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;