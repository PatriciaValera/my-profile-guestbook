// frontend/src/App.jsx - Updated version with correct URL handling

import { useEffect, useState } from 'react';
import './App.css';

// Use environment variable if available, otherwise fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/guestbook';

// Add debug log to see what URL is being used
console.log('🔧 Using API URL:', API_URL);

function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchEntries = async () => {
    try {
      setError('');
      console.log('📡 Fetching from:', API_URL);
      
      const res = await fetch(API_URL);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('✅ Fetched entries:', data);
      setEntries(data);
    } catch (error) {
      console.error('❌ Error fetching entries:', error);
      setError(`Failed to load messages: ${error.message}. Is the backend running?`);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      console.log('📤 Sending request:', { method, url, data: form });

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      // Get response text first
      const responseText = await res.text();
      console.log('📥 Response text:', responseText);

      // Try to parse as JSON if possible
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('✅ Response data:', responseData);
      } catch (e) {
        console.log('Response is not JSON:', responseText);
      }

      if (!res.ok) {
        throw new Error(`Server error: ${res.status} - ${responseText}`);
      }

      setForm({ name: '', message: '' });
      setEditingId(null);
      fetchEntries(); // Refresh the list
      
    } catch (error) {
      console.error('❌ Error saving entry:', error);
      setError(`Failed to save message: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    
    try {
      setError('');
      console.log('📤 Deleting:', `${API_URL}/${id}`);
      
      const res = await fetch(`${API_URL}/${id}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const responseText = await res.text();
      console.log('📥 Delete response:', responseText);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      fetchEntries();
    } catch (error) {
      console.error('❌ Error deleting entry:', error);
      setError(`Failed to delete message: ${error.message}`);
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
        <p>Leave a message for me! 🎉</p>
      </header>

      {error && (
        <div style={{ 
          background: '#ffebee', 
          color: '#c62828', 
          padding: '1rem', 
          borderRadius: '10px',
          marginBottom: '1rem',
          textAlign: 'center',
          border: '1px solid #ef9a9a'
        }}>
          ❌ {error}
        </div>
      )}

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
              {loading ? 'Saving...' : editingId ? 'Update Message' : 'Sign Guestbook'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: '', message: '' });
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <section className="entries-section">
          <h2>Messages ({entries.length})</h2>
          
          {entries.length === 0 ? (
            <p className="no-messages">
              {error ? '⚠️ Error loading messages' : 'No messages yet. Be the first! 🍄'}
            </p>
          ) : (
            <div className="entries-grid">
              {entries.map((entry) => (
                <div key={entry.id} className="entry-card">
                  <div className="entry-header">
                    <strong>{entry.name}</strong>
                    <span className="entry-date">
                      {new Date(entry.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="entry-message">{entry.message}</p>
                  <div className="entry-actions">
                    <button onClick={() => startEdit(entry)} className="edit-btn">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(entry.id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      
      {/* Debug info - remove in production */}
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '5px', fontSize: '0.8rem' }}>
        <strong>Debug:</strong> API URL: {API_URL}
      </div>
    </div>
  );
}

export default App;