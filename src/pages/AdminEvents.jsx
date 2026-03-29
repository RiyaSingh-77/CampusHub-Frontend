import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './AdminEvents.css';

export default function AdminEvents() {
  const navigate = useNavigate();

  const [authed, setAuthed]     = useState(false);
  const [checking, setChecking] = useState(true); // checking token on mount
  const [events, setEvents]     = useState([]);
  const [loading, setLoading]   = useState(false);
  const [filter, setFilter]     = useState('pending');
  const [actionId, setActionId] = useState(null);

  // ── On mount: check if logged-in user is admin ──
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      setChecking(false);
      return;
    }
    try {
      const user = JSON.parse(stored);
      if (user?.role === 'admin') {
        setAuthed(true);
      }
    } catch {
      // malformed storage
    }
    setChecking(false);
  }, []);

  // ── Fetch all submissions once authed ──
  useEffect(() => {
    if (authed) fetchEvents();
  }, [authed]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/events/admin/all');
      setEvents(res.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setAuthed(false); // token valid but not admin
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    setActionId(id);
    try {
      await api.patch(`/events/admin/${id}`, { status });
      setEvents(prev => prev.map(e => e._id === id ? { ...e, status } : e));
    } catch (err) {
      alert('Action failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this submission permanently?')) return;
    setActionId(id);
    try {
      await api.delete(`/events/admin/${id}`);
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionId(null);
    }
  };

  const filtered = events.filter(e => e.status === filter);
  const counts = {
    pending:  events.filter(e => e.status === 'pending').length,
    approved: events.filter(e => e.status === 'approved').length,
    rejected: events.filter(e => e.status === 'rejected').length,
  };

  // ── Still checking localStorage ──
  if (checking) return null;

  // ── Not admin ──
  if (!authed) {
    return (
      <div className="admin-gate">
        <div className="admin-gate__card">
          <div className="admin-gate__icon">🚫</div>
          <h2>Access Denied</h2>
          <p>You need to be logged in as an admin to view this page.</p>
          <button className="auth-btn" onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-events-page">
      <div className="container">

        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="page-title">⚙️ Event Submissions</h1>
            <p className="page-sub">Review and approve society event requests before they go live.</p>
          </div>
          <button className="post-btn" onClick={fetchEvents}>↻ Refresh</button>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="admin-stat admin-stat--pending">
            <span className="admin-stat__num">{counts.pending}</span>
            <span className="admin-stat__label">Pending</span>
          </div>
          <div className="admin-stat admin-stat--approved">
            <span className="admin-stat__num">{counts.approved}</span>
            <span className="admin-stat__label">Approved</span>
          </div>
          <div className="admin-stat admin-stat--rejected">
            <span className="admin-stat__num">{counts.rejected}</span>
            <span className="admin-stat__label">Rejected</span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="filter-row" style={{ marginBottom: 24 }}>
          {['pending', 'approved', 'rejected'].map(f => (
            <button
              key={f}
              className={`pill ${filter === f ? 'pill--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          ))}
        </div>

        {loading && <div className="empty-state"><p>Loading submissions...</p></div>}

        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <span style={{ fontSize: 36 }}>📭</span>
            <p>No {filter} submissions.</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="admin-cards">
            {filtered.map(ev => (
              <div key={ev._id} className={`admin-card admin-card--${ev.status}`}>

                <span className={`admin-badge admin-badge--${ev.status}`}>{ev.status}</span>

                <div className="admin-card__society">
                  <strong>{ev.societyAbbr}</strong> — {ev.societyName}
                  <span className="admin-card__email">✉️ {ev.contactEmail}</span>
                </div>

                <h3 className="admin-card__title">{ev.eventTitle}</h3>
                <p className="admin-card__desc">{ev.eventDesc}</p>

                <div className="admin-card__meta">
                  <span>📅 {new Date(ev.dateStart).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} – {new Date(ev.dateEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span>📍 {ev.venue}</span>
                  {ev.tags && <span>🏷️ {ev.tags}</span>}
                  {ev.registerUrl && (
                    <a href={ev.registerUrl} target="_blank" rel="noreferrer" className="admin-card__link">
                      🔗 Registration Link
                    </a>
                  )}
                </div>

                <p className="admin-card__submitted">
                  Submitted: {new Date(ev.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>

                <div className="admin-card__actions">
                  {ev.status !== 'approved' && (
                    <button className="admin-btn admin-btn--approve"
                      onClick={() => handleAction(ev._id, 'approved')}
                      disabled={actionId === ev._id}>
                      ✅ Approve
                    </button>
                  )}
                  {ev.status !== 'rejected' && (
                    <button className="admin-btn admin-btn--reject"
                      onClick={() => handleAction(ev._id, 'rejected')}
                      disabled={actionId === ev._id}>
                      ❌ Reject
                    </button>
                  )}
                  <button className="admin-btn admin-btn--delete"
                    onClick={() => handleDelete(ev._id)}
                    disabled={actionId === ev._id}>
                    🗑 Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
