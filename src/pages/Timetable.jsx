import { useState, useEffect, useRef } from 'react';
import api from '../api';
import './Timetable.css';

const BRANCHES = [
  'CSE', 'ECE', 'ME', 'CE',
  'Chemical Engineering', 'Electrical',
  'Material Science', 'Engineering Physics',
];
const YEARS    = [1, 2, 3, 4];
const SECTIONS = ['A', 'B'];
const DAYS     = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const PERIODS  = ['9:00-9:50', '10:00-10:50', '11:00-11:50', '12:00-12:50', '1:00-1:50', '2:00-2:50'];

export default function Timetable() {
  const [branch, setBranch]       = useState('CSE');
  const [year, setYear]           = useState(1);
  const [section, setSection]     = useState('A');
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    const fetchTimetable = async () => {
      setLoading(true);
      try {
        const res = await api.get('/timetable', { params: { branch, year, section } });
        setTimetable(res.data);
      } catch {
        setTimetable(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, [branch, year, section]);

  const handlePdfUpload = async e => {
    e.preventDefault();
    const file = fileRef.current.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setUploadMsg('Please select a PDF file only.');
      return;
    }

    setUploading(true);
    setUploadMsg('');
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('branch', branch);
      formData.append('year', year);
      formData.append('section', section);

      const res = await api.post('/timetable/upload-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadMsg('Timetable uploaded successfully! Thank you.');
      setTimetable(prev => ({ ...prev, pdfUrl: res.data.pdfUrl }));
      setShowUpload(false);
      fileRef.current.value = '';
    } catch (err) {
      setUploadMsg(err.response?.data?.message || 'Upload failed. Are you logged in?');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePdf = async () => {
    if (!window.confirm('Remove this timetable PDF?')) return;
    try {
      await api.delete('/timetable/delete-pdf', {
        params: { branch, year, section }
      });
      setTimetable(prev => ({ ...prev, pdfUrl: null }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete PDF');
    }
  };

  return (
    <div className="timetable-page">
      <div className="container">

        {/* Header */}
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
            <select value={year} onChange={e => setYear(Number(e.target.value))} className="select-box">
              {YEARS.map(y => <option key={y} value={y}>{y} Year</option>)}
            </select>
          </div>
          <div className="select-group">
            <label className="select-label">Section</label>
            <select value={section} onChange={e => setSection(e.target.value)} className="select-box">
              {SECTIONS.map(s => <option key={s}>Section {s}</option>)}
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="tt-empty">
            <p>Loading timetable...</p>
          </div>
        )}

        {/* PDF viewer */}
        {!loading && timetable?.pdfUrl && (
          <div className="tt-card">
            <div className="tt-card__header">
              <h2 className="tt-card__heading">
                {branch} — Year {year}, Section {section}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {timetable.uploadedBy && (
                  <span className="tt-uploaded-by">
                    Uploaded by {timetable.uploadedBy.name}
                  </span>
                )}
                <button className="tt-delete-btn" onClick={handleDeletePdf}>
                  🗑️ Remove PDF
                </button>
              </div>
            </div>
            <div className="tt-pdf-viewer">
              <iframe
                src={`${timetable.pdfUrl}?tr=orig-true`}
                title="Timetable PDF"
                className="tt-pdf-frame"
              />
            </div>
          </div>
        )}

        {/* Structured table if schedule exists but no PDF */}
        {!loading && timetable?.schedule?.length > 0 && !timetable?.pdfUrl && (
          <div className="tt-card">
            <div className="tt-card__header">
              <h2 className="tt-card__heading">
                {branch} — Year {year}, Section {section}
              </h2>
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
                  {DAYS.map((day, di) => {
                    const dayData = timetable.schedule.find(d => d.day === day);
                    return (
                      <tr key={day} className={di % 2 === 0 ? 'tt-row--even' : ''}>
                        <td className="tt-td tt-td--day">{day}</td>
                        {PERIODS.map((_, pi) => {
                          const slot = dayData?.slots?.find(s => s.period === pi + 1);
                          return (
                            <td key={pi} className="tt-td">
                              {slot ? (
                                <div className="cell-slot">
                                  <span className="cell-subject">{slot.subject}</span>
                                  <span className="cell-faculty">{slot.faculty}</span>
                                  <span className="cell-room">{slot.room}</span>
                                </div>
                              ) : (
                                <span className="cell-empty">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No timetable found */}
        {!loading && !timetable && (
          <div className="tt-empty">
            <span style={{ fontSize: 40 }}>📅</span>
            <p>No timetable found for {branch} Year {year} Section {section} yet.</p>
          </div>
        )}

        {/* Upload CTA */}
        <div className="tt-upload-cta">
          <div className="tt-upload-cta__text">
            <h3>Have your class timetable?</h3>
            <p>Help your batchmates — upload a PDF of your timetable and it will be visible to everyone in your class.</p>
          </div>
          <button
            className="tt-upload-btn"
            onClick={() => setShowUpload(s => !s)}
          >
            {showUpload ? 'Cancel' : '📤 Upload Timetable PDF'}
          </button>
        </div>

        {/* Upload form */}
        {showUpload && (
          <div className="tt-upload-form">
            <p className="tt-upload-note">
              Uploading for: <strong>{branch} — Year {year}, Section {section}</strong>
              <br />
              <span>Change branch/year/section above before uploading.</span>
            </p>

            <form onSubmit={handlePdfUpload} className="tt-upload-row">
              <input
                type="file"
                accept=".pdf"
                ref={fileRef}
                className="tt-file-input"
              />
              <button type="submit" className="auth-btn tt-submit-btn" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload PDF'}
              </button>
            </form>

            {uploadMsg && (
              <p className={`tt-upload-msg ${uploadMsg.includes('success') ? 'success' : 'error'}`}>
                {uploadMsg}
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}