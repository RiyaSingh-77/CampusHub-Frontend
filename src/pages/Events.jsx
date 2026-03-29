import { useState } from 'react';
import './Events.css';

const SOCIETIES = [
  {
    id: 'iste',
    abbr: 'ISTE',
    name: 'Indian Society for Technical Education',
    desc: 'ISTE advances technical education through workshops, seminars, and flagship events that bridge academic learning with industry skills.',
    color: '#4A90D9',
    bg: '#EAF3FB',
    events: [
      {
        id: 1,
        title: 'Prodyogiki',
        desc: 'The annual techno-cultural fest featuring coding contests, robotics challenges, guest lectures, and cultural performances over three action-packed days.',
        dateStart: 'March 14',
        dateEnd: 'March 16, 2026',
        venue: 'Main Auditorium, NIT Hamirpur',
        tags: ['Tech Fest', 'Cultural', 'Competitions'],
        registerUrl: '#',
        accent: '#4A90D9',
      },
    ],
  },
  {
    id: 'spec',
    abbr: 'SPEC',
    name: 'Society for Promotion of Electronics Culture',
    desc: 'SPEC fosters innovation in electronics and embedded systems through hands-on workshops, hackathons, and inter-college competitions.',
    color: '#27AE60',
    bg: '#E9F7EF',
    events: [
      {
        id: 2,
        title: 'Electrothon',
        desc: 'A 48-hour hackathon bringing together developers, designers, and innovators to build hardware and software solutions for real-world problems.',
        dateStart: 'March 21',
        dateEnd: 'March 23, 2026',
        venue: 'Electronics Block, NIT Hamirpur',
        tags: ['Hackathon', 'Electronics', 'Innovation'],
        registerUrl: '#',
        accent: '#27AE60',
      },
    ],
  },
  {
    id: 'csec',
    abbr: 'CSEC',
    name: 'Computer Science & Engineering Club',
    desc: 'CSEC is the hub for all things CS — from competitive programming and open-source contributions to flagship hackathons and developer meetups.',
    color: '#8B5CF6',
    bg: '#F3EFFE',
    events: [
      {
        id: 3,
        title: 'Hack on Hills',
        desc: 'A weekend-long open hackathon in the hills where participants collaborate to ship creative projects across web, mobile, AI/ML, and blockchain tracks.',
        dateStart: 'April 5',
        dateEnd: 'April 6, 2026',
        venue: 'CSE Block, NIT Hamirpur',
        tags: ['Hackathon', 'Open Source', 'AI/ML'],
        registerUrl: '#',
        accent: '#8B5CF6',
      },
    ],
  },
];

const ALL_TAGS = ['All', 'Hackathon', 'Tech Fest', 'Cultural', 'Electronics', 'AI/ML', 'Competitions', 'Innovation'];

const EMPTY_FORM = {
  societyName: '',
  societyAbbr: '',
  contactEmail: '',
  eventTitle: '',
  eventDesc: '',
  dateStart: '',
  dateEnd: '',
  venue: '',
  tags: '',
  registerUrl: '',
};

export default function Events() {
  const [activeTag, setActiveTag] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Flatten all events with society info for filtering
  const allEvents = SOCIETIES.flatMap(s =>
    s.events.map(e => ({ ...e, society: s }))
  );

  const filtered = allEvents.filter(e => {
    const matchTag = activeTag === 'All' || e.tags.includes(activeTag);
    const matchSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.society.name.toLowerCase().includes(search.toLowerCase()) ||
      e.desc.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  // Group filtered events back by society
  const groupedSocieties = SOCIETIES.map(s => ({
    ...s,
    events: filtered.filter(e => e.society.id === s.id),
  })).filter(s => s.events.length > 0);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900)); // simulate API
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSubmitted(false);
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

        {/* ── Societies + Events ── */}
        {groupedSocieties.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: 40 }}>🔍</span>
            <p>No events found. Try a different search or tag.</p>
          </div>
        ) : (
          <div className="societies-list">
            {groupedSocieties.map(society => (
              <div key={society.id} className="society-section">
                {/* Society header */}
                <div className="society-header">
                  <div
                    className="society-avatar"
                    style={{ background: society.bg, color: society.color }}
                  >
                    {society.abbr}
                  </div>
                  <div className="society-info">
                    <div className="society-title-row">
                      <span className="society-abbr" style={{ color: society.color }}>
                        {society.abbr}
                      </span>
                      <span className="society-dash">—</span>
                      <span className="society-fullname">{society.name}</span>
                    </div>
                    <p className="society-desc">{society.desc}</p>
                  </div>
                </div>

                {/* Accent bar */}
                <div className="society-bar" style={{ background: society.color }} />

                {/* Events under this society */}
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
                            {event.dateStart} – {event.dateEnd}
                          </span>
                          <span className="event-meta-item">
                            <span className="event-meta-icon">📍</span>
                            {event.venue}
                          </span>
                        </div>

                        <div className="event-card__tags">
                          {event.tags.map(tag => (
                            <span
                              key={tag}
                              className="event-tag"
                              onClick={() => setActiveTag(tag)}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <a
                          href={event.registerUrl}
                          className="register-btn"
                          style={{ background: event.accent }}
                          target="_blank"
                          rel="noreferrer"
                        >
                          🔗 Register Now
                        </a>
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
            <p>
              List your event for free so students can discover and register easily.
              All NIT Hamirpur societies are welcome.
            </p>
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
                {submitted ? '🎉 Request Submitted!' : '📋 List Your Society\'s Event'}
              </h2>
              <button className="modal__close" onClick={handleClose}>✕</button>
            </div>

            {submitted ? (
              <div className="modal__success">
                <div className="modal__success-icon">✅</div>
                <p className="modal__success-msg">
                  Your event listing request has been received! Our team will review and publish
                  it on the Events page shortly.
                </p>
                <button className="auth-btn" onClick={handleClose}>Done</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal__form">
                <p className="modal__subtitle">
                  Fill in your society and event details. We'll review and add it to the page.
                </p>

                <div className="modal__section-label">Society Info</div>
                <div className="modal__row">
                  <div className="form-group">
                    <label>Society Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Science & Engineering Club"
                      value={form.societyName}
                      onChange={e => setForm({ ...form, societyName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Abbreviation</label>
                    <input
                      type="text"
                      placeholder="e.g. CSEC"
                      value={form.societyAbbr}
                      onChange={e => setForm({ ...form, societyAbbr: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Contact Email</label>
                  <input
                    type="email"
                    placeholder="society@nith.ac.in"
                    value={form.contactEmail}
                    onChange={e => setForm({ ...form, contactEmail: e.target.value })}
                    required
                  />
                </div>

                <div className="modal__section-label">Event Details</div>
                <div className="form-group">
                  <label>Event Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Hack on Hills 2026"
                    value={form.eventTitle}
                    onChange={e => setForm({ ...form, eventTitle: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Briefly describe what the event is about..."
                    value={form.eventDesc}
                    onChange={e => setForm({ ...form, eventDesc: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="modal__row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={form.dateStart}
                      onChange={e => setForm({ ...form, dateStart: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={form.dateEnd}
                      onChange={e => setForm({ ...form, dateEnd: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Venue</label>
                  <input
                    type="text"
                    placeholder="e.g. Main Auditorium, NIT Hamirpur"
                    value={form.venue}
                    onChange={e => setForm({ ...form, venue: e.target.value })}
                    required
                  />
                </div>

                <div className="modal__row">
                  <div className="form-group">
                    <label>Tags <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(comma separated)</span></label>
                    <input
                      type="text"
                      placeholder="Hackathon, AI/ML, Open Source"
                      value={form.tags}
                      onChange={e => setForm({ ...form, tags: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Registration Link</label>
                    <input
                      type="url"
                      placeholder="https://forms.google.com/..."
                      value={form.registerUrl}
                      onChange={e => setForm({ ...form, registerUrl: e.target.value })}
                    />
                  </div>
                </div>

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
