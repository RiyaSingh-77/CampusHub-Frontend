import { useState, useEffect } from 'react';
import api from '../api';
import './Events.css';

// ── Colour palette for DB-sourced societies (cycles through these) ──
const SOCIETY_COLORS = [
  { color: '#4A90D9', bg: '#EAF3FB' },
  { color: '#27AE60', bg: '#E9F7EF' },
  { color: '#8B5CF6', bg: '#F3EFFE' },
  { color: '#E67E22', bg: '#FEF3E7' },
  { color: '#E91E8C', bg: '#FDE8F4' },
  { color: '#00897B', bg: '#E0F4F2' },
];

const ALL_TAGS = ['All', 'Hackathon', 'Tech Fest', 'Cultural', 'Electronics', 'AI/ML', 'Competitions', 'Innovation', 'Open Source'];

const EMPTY_FORM = {
  societyName: '', societyAbbr: '', contactEmail: '',
  eventTitle: '', eventDesc: '', dateStart: '',
  dateEnd: '', venue: '', tags: '', registerUrl: '',
};

// ── Helper: group flat DB events array into societies ──
function groupBySociety(events) {
  const map = {};
  events.forEach(e => {
    const key = e.societyAbbr.toUpperCase();
    if (!map[key]) {
      const idx = Object.keys(map).length % SOCIETY_COLORS.length;
      const palette = SOCIETY_COLORS[idx];
      map[key] = {
        id: key,
        abbr: key,
        name: e.societyName,
        color: palette.color,
        bg: palette.bg,
        events: [],
      };
    }
    map[key].events.push({
      ...e,
      id: e._id,
      title: e.eventTitle,
      desc: e.eventDesc,
      tags: e.tags ? e.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      accent: map[key].color,
    });
  });
  return Object.values(map);
}

export default function Events() {
  const [societies, setSocieties]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeTag, setActiveTag]   = useState('All');
  const [search, setSearch]         = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');

  // ── Fetch approved events from backend ──
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/events');
        setSocieties(groupBySociety(res.data));
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Filter logic ──
  const allEvents = societies.flatMap(s => s.events.map(e => ({ ...e, society: s })));

  const filtered = allEvents.filter(e => {
    const matchTag    = activeTag === 'All' || e.tags.includes(activeTag);
    const matchSearch = !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.society.name.toLowerCase().includes(search.toLowerCase()) ||
      e.desc.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  const groupedSocieties = societies.map(s => ({
    ...s,
    events: filtered.filter(e => e.society.id === s.id),
  })).filter(s => s.events.length > 0);

  // ── Submit form to backend ──
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/events', form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSubmitted(false);
    setError('');
    setForm(EMPTY_FORM);
  };

  return (
    <div className="events-page">
      <div className="container">

        {/* ── Hero Header ── */}
        <div className="events-hero">
          <div className="events-hero__icon">🎯</div>
          <div>
            <h1 className="page-title">Societies &amp; Events</h1>
            <p className="page-sub">
              Discover college societies and their upcoming events — register before spots fill up!
            </p>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="events-toolbar">
          <div className="search-box">
            <span className="search-box__icon">🔍</span>
            <input
              type="text"
              className="search-box__input"
              placeholder="Search events or societies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="post-btn" onClick={() => setShowModal(true)}>
            <span>＋</span> List Your Society's Event
          </button>
        </div>

        {/* ── Tag Pills ── */}
        <div className="filter-row">
          {ALL_TAGS.map(tag => (
            <button
              key={tag}
              className={`pill ${activeTag === tag ? 'pill--active' : ''}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="empty-state"><p>Loading events...</p></div>
        )}

        {/* ── Empty ── */}
        {!loading && groupedSocieties.length === 0 && (
          <div className="empty-state">
            <span style={{ fontSize: 40 }}>🔍</span>
            <p>No events found. Try a different search or tag.</p>
          </div>
        )}

        {/* ── Societies + Events ── */}
        {!loading && groupedSocieties.length > 0 && (
          <div className="societies-list">
            {groupedSocieties.map(society => (
              <div key={society.id} className="society-section">

                <div className="society-header">
                  <div className="society-avatar" style={{ background: society.bg, color: society.color }}>
                    {society.abbr}
                  </div>
                  <div className="society-info">
                    <div className="society-title-row">
                      <span className="society-abbr" style={{ color: society.color }}>{society.abbr}</span>
                      <span className="society-dash">—</span>
                      <span className="society-fullname">{society.name}</span>
                    </div>
                  </div>
                </div>

                <div className="society-bar" style={{ background: society.color }} />

                <div className="events-list">
                  {society.events.map(event => (
                    <div key={event.id} className="event-card">
                      <div className="event-card__accent" style={{ background: event.accent }} />
                      <div className="event-card__body">
                        <h3 className="event-card__title">{event.title}</h3>
                        <p className="event-card__desc">{event.desc}</p>

                        <div className="event-card__meta">
                          <span className="event-meta-item">
                            <span className="event-meta-icon">📅</span>
                            {new Date(event.dateStart).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {' – '}
                            {new Date(event.dateEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="event-meta-item">
                            <span className="event-meta-icon">📍</span>
                            {event.venue}
                          </span>
                        </div>

                        <div className="event-card__tags">
                          {event.tags.map(tag => (
                            <span key={tag} className="event-tag" onClick={() => setActiveTag(tag)}>
                              {tag}
                            </span>
                          ))}
                        </div>

                        {event.registerUrl && (
                          <a
                            href={event.registerUrl}
                            className="register-btn"
                            style={{ background: event.accent }}
                            target="_blank"
                            rel="noreferrer"
                          >
                            🔗 Register Now
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}

        {/* ── Society CTA Banner ── */}
        <div className="society-cta">
          <div className="society-cta__icon">📢</div>
          <div className="society-cta__text">
            <h3>Running a society event?</h3>
            <p>List your event for free so students can discover and register easily. All NIT Hamirpur societies are welcome.</p>
          </div>
          <button className="society-cta__btn" onClick={() => setShowModal(true)}>
            List Your Event
          </button>
        </div>

      </div>

      {/* ── Submit Event Modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal modal--wide" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">
                {submitted ? '🎉 Request Submitted!' : "📋 List Your Society's Event"}
              </h2>
              <button className="modal__close" onClick={handleClose}>✕</button>
            </div>

            {submitted ? (
              <div className="modal__success">
                <div className="modal__success-icon">✅</div>
                <p className="modal__success-msg">
                  Your event has been submitted and is now live on the Events page!
                </p>
                <button className="auth-btn" onClick={handleClose}>Done</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal__form">
                <p className="modal__subtitle">
                  Fill in your society and event details. It will be published immediately.
                </p>

                <div className="modal__section-label">Society Info</div>
                <div className="modal__row">
                  <div className="form-group">
                    <label>Society Full Name</label>
                    <input type="text" placeholder="e.g. Computer Science & Engineering Club"
                      value={form.societyName} onChange={e => setForm({ ...form, societyName: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Abbreviation</label>
                    <input type="text" placeholder="e.g. CSEC"
                      value={form.societyAbbr} onChange={e => setForm({ ...form, societyAbbr: e.target.value })} required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Contact Email</label>
                  <input type="email" placeholder="society@nith.ac.in"
                    value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} required />
                </div>

                <div className="modal__section-label">Event Details</div>
                <div className="form-group">
                  <label>Event Title</label>
                  <input type="text" placeholder="e.g. Hack on Hills 2026"
                    value={form.eventTitle} onChange={e => setForm({ ...form, eventTitle: e.target.value })} required />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea placeholder="Briefly describe what the event is about..."
                    value={form.eventDesc} onChange={e => setForm({ ...form, eventDesc: e.target.value })} rows={3} required />
                </div>

                <div className="modal__row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input type="date" value={form.dateStart}
                      onChange={e => setForm({ ...form, dateStart: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input type="date" value={form.dateEnd}
                      onChange={e => setForm({ ...form, dateEnd: e.target.value })} required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Venue</label>
                  <input type="text" placeholder="e.g. Main Auditorium, NIT Hamirpur"
                    value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} required />
                </div>

                <div className="form-group">
            <label>Tags</label>
            <select
              multiple
              value={form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []}
              onChange={e => {
                const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                setForm({ ...form, tags: selected.join(', ') });
              }}
              style={{ height: '120px' }}
            >
              {ALL_TAGS.filter(t => t !== 'All').map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            <small style={{ color: 'var(--text-muted)' }}>Hold Ctrl / Cmd to select multiple</small>
      </div>


                  <div className="form-group">
                    <label>Registration Link</label>
                    <input type="url" placeholder="https://forms.google.com/..."
                      value={form.registerUrl} onChange={e => setForm({ ...form, registerUrl: e.target.value })} />
                  </div>
                </div>

                {error && <p className="tt-upload-msg error">{error}</p>}

                <button type="submit" className="auth-btn" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit for Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
