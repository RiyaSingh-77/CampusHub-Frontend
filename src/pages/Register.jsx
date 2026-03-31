import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import './Auth.css';

const BRANCHES = ['CSE', 'ECE','EE', 'ME', 'CE', 'Chemical', 'Engineering Physics', 'Mnc', 'Architecture','Material Science'];
const YEARS = [1, 2, 3, 4];
const SECTIONS = ['A', 'B', 'C', 'D'];
const ROLES = [
  { value: 'student',       label: '🎓 Student' },
  { value: 'vendor',        label: '🛒 Vendor' },
  { value: 'mess_incharge', label: '🍽️ Mess Incharge' },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', rollNo: '', branch: 'CSE',
    year: 1, section: 'A', phone: '',
    password: '', hostel: '', role: 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', {
        ...form,
        year: Number(form.year),
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const isStudent = form.role === 'student';

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <div className="auth-logo">🏛️ CampusHub</div>
        <h1 className="auth-title">New here? Create your account</h1>
        <p className="auth-sub">Join your campus community</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">

          {/* ── ROLE SELECTOR ── */}
          <div className="form-group">
            <label>I am a...</label>
            <div className="role-selector">
              {ROLES.map(r => (
                <button
                  key={r.value}
                  type="button"
                  className={`role-btn ${form.role === r.value ? 'role-btn--active' : ''}`}
                  onClick={() => setForm({ ...form, role: r.value })}
                >
                  <span className="role-btn-icon">{r.label.split(' ')[0]}</span>
                  <span className="role-btn-text">{r.label.split(' ').slice(1).join(' ')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── NAME + ROLL NO ── */}
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="Alex Neilson"
                value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>{isStudent ? 'Roll Number' : 'ID'}</label>

               <input
              type="text"
              name="rollNo"
              placeholder={
                isStudent ? "23bec083"
                : form.role === 'vendor' ? "Vendor_no."
                : "Incharge_Hostel"
              }
              value={form.rollNo}
              onChange={handleChange}
              required
            />
              

            </div>
          </div>

          {/* ── STUDENT-ONLY FIELDS ── */}
          {isStudent && (
            <div className="form-row">
              <div className="form-group">
                <label>Branch</label>
                <select name="branch" value={form.branch} onChange={handleChange}>
                  {BRANCHES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Year</label>
                <select name="year" value={form.year} onChange={handleChange}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Section</label>
                <select name="section" value={form.section} onChange={handleChange}>
                  {SECTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* ── PHONE + HOSTEL (hostel only for students) ── */}
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input type="text" name="phone" placeholder="98********"
                value={form.phone} onChange={handleChange} required />
            </div>
            {isStudent && (
              <div className="form-group">
                <label>Hostel (optional)</label>
                <input type="text" name="hostel" placeholder="PGH / Hostel 3"
                  value={form.hostel} onChange={handleChange} />
              </div>
            )}
          </div>

          {/* ── PASSWORD ── */}
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Choose a password"
              value={form.password} onChange={handleChange} required />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}