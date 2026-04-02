import { useState } from 'react';
import './Calendar.css';

const calendarData = {
  "Odd Semester (July – November 2025)": [
    { date: "July 1", event: "Semester Begins", type: "academic" },
    { date: "August 15", event: "Independence Day", type: "holiday" },
    { date: "October 2", event: "Gandhi Jayanti", type: "holiday" },
    { date: "October 20–25", event: "Mid Semester Exams", type: "exam" },
    { date: "November 10", event: "Last Teaching Day", type: "academic" },
    { date: "November 15–30", event: "End Semester Exams", type: "exam" },
  ],
  "Even Semester (January – May 2026)": [
    { date: "January 6", event: "Semester Begins", type: "academic" },
    { date: "January 26", event: "Republic Day", type: "holiday" },
    { date: "March 3–8", event: "Mid Semester Exams", type: "exam" },
    { date: "March 25", event: "Holi", type: "holiday" },
    { date: "April 14", event: "Dr. Ambedkar Jayanti", type: "holiday" },
    { date: "April 25", event: "Last Teaching Day", type: "academic" },
    { date: "May 1–15", event: "End Semester Exams", type: "exam" },
  ],
};

const typeStyles = {
  holiday: { bg: '#FEF3C7', color: '#D97706', label: 'Holiday' },
  exam:    { bg: '#FEE2E2', color: '#DC2626', label: 'Exam'    },
  academic:{ bg: '#DBEAFE', color: '#1D4ED8', label: 'Academic'},
};

export default function Calendar() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="cal-page">
      <div className="cal-container">

        {/* Header */}
        <div className="cal-header">
          <span className="cal-icon">📅</span>
          <h1 className="cal-title">Academic Calendar</h1>
          <p className="cal-sub">Semester schedule, holidays &amp; exam dates — all in one place.</p>
        </div>

        {/* Filter Pills */}
        <div className="cal-filters">
          {['all', 'academic', 'exam', 'holiday'].map(f => (
            <button
              key={f}
              className={`cal-pill ${filter === f ? 'cal-pill--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Sections */}
        {Object.entries(calendarData).map(([semester, events]) => {
          const filtered = filter === 'all' ? events : events.filter(e => e.type === filter);
          if (!filtered.length) return null;
          return (
            <div key={semester} className="cal-section">
              <h2 className="cal-semester">{semester}</h2>
              <div className="cal-list">
                {filtered.map((e, i) => {
                  const s = typeStyles[e.type];
                  return (
                    <div key={i} className="cal-item">
                      <div className="cal-item__date">{e.date}</div>
                      <div className="cal-item__event">{e.event}</div>
                      <span className="cal-item__badge" style={{ background: s.bg, color: s.color }}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}