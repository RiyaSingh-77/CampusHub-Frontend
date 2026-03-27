import { useState } from 'react';
import './Timetable.css';

const BRANCHES  = ['Computer Science', 'Mechanical', 'Electronics', 'Civil', 'Chemical'];
const YEARS     = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const SECTIONS  = ['Section A', 'Section B', 'Section C'];

const PERIODS = [
  '9:00 - 9:50', '10:00 - 10:50', '11:00 - 11:50',
  '12:00 - 12:50', '1:00 - 1:50', '2:00 - 2:50',
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Sample timetable data
const SAMPLE_DATA = {
  Monday:    ['—', 'Computer Networks / Prof. Singh / LH-202', 'Operating Systems / Dr. Verma / LH-101', 'AI/ML / Prof. Joshi / LH-202', 'Lunch', 'AI/ML / Prof. Joshi / Lab-3'],
  Tuesday:   ['Compiler Design / Dr. Patel / LH-102', '—', 'AI/ML / Prof. Joshi / LH-202', 'Compiler Design / Dr. Patel / LH-102', 'Lunch', 'Software Engg. / Prof. Kumar / Lab-1'],
  Wednesday: ['Data Structures / Dr. Mehta / LH-301', 'AI/ML / Prof. Joshi / LH-202', 'Operating Systems / Dr. Verma / LH-101', '—', 'Lunch', 'Data Structures / Dr. Mehta / Lab-2'],
  Thursday:  ['—', 'Software Engg. / Prof. Kumar / LH-102', 'Compiler Design / Dr. Patel / LH-102', 'Computer Networks / Prof. Singh / LH-202', 'Lunch', '—'],
  Friday:    ['AI/ML / Prof. Joshi / LH-202', 'Data Structures / Dr. Mehta / LH-301', '—', 'Operating Systems / Dr. Verma / LH-101', 'Lunch', 'Computer Networks / Prof. Singh / Lab-3'],
};

function CellContent({ raw }) {
  if (raw === '—') return <span className="cell-empty">—</span>;
  if (raw === 'Lunch') return <span className="cell-lunch">Lunch</span>;
  const [subject, faculty, room] = raw.split(' / ');
  return (
    <div className="cell-slot">
      <span className="cell-subject">{subject}</span>
      <span className="cell-faculty">{faculty}</span>
      <span className="cell-room">{room}</span>
    </div>
  );
}

export default function Timetable() {
  const [branch, setBranch]   = useState('Computer Science');
  const [year, setYear]       = useState('1st Year');
  const [section, setSection] = useState('Section A');

  return (
    <div className="timetable-page">
      <div className="container">

        <div className="page-header">
          <div className="page-header__icon">🗓️</div>
          <div>
            <h1 className="page-title">Class Timetable</h1>
            <p className="page-sub">Select your branch, year & section to view the weekly schedule.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="tt-filters">
          <div className="select-group">
            <label className="select-label">Branch</label>
            <select value={branch} onChange={e => setBranch(e.target.value)} className="select-box">
              {BRANCHES.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="select-group">
            <label className="select-label">Year</label>
            <select value={year} onChange={e => setYear(e.target.value)} className="select-box">
              {YEARS.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div className="select-group">
            <label className="select-label">Section</label>
            <select value={section} onChange={e => setSection(e.target.value)} className="select-box">
              {SECTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="tt-card">
          <div className="tt-card__header">
            <h2 className="tt-card__heading">{branch} — {year}, {section}</h2>
          </div>

          <div className="tt-scroll">
            <table className="tt-table">
              <thead>
                <tr>
                  <th className="tt-th tt-th--day">Day</th>
                  {PERIODS.map(p => <th key={p} className="tt-th">{p}</th>)}
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day, di) => (
                  <tr key={day} className={di % 2 === 0 ? 'tt-row--even' : ''}>
                    <td className="tt-td tt-td--day">{day}</td>
                    {(SAMPLE_DATA[day] || []).map((cell, ci) => (
                      <td key={ci} className={`tt-td ${cell === 'Lunch' ? 'tt-td--lunch' : ''}`}>
                        <CellContent raw={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
