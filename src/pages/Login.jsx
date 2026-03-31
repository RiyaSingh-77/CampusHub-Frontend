import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import './Auth.css';

const ROLES = [
  { value: 'student',       label: '🎓 Student' },
  { value: 'vendor',        label: '🛒 Vendor' },
  { value: 'mess_incharge', label: '🍽️ Mess Incharge' },
];

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ rollNo: '', password: '' });
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
      const res = await api.post('/auth/login', form);

      // Extra check: make sure the role they selected matches their actual account
      if (res.data.user.role !== role) {
        setError(`This account is not registered as a ${ROLES.find(r => r.value === role)?.label.split(' ').slice(1).join(' ')}. Please select the correct role.`);
        setLoading(false);
        return;
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const isStudent = role === 'student';

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🏛️ CampusHub</div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Who is trying to log in?</p>

        {/* ── ROLE SELECTOR ── */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <div className="role-selector">
            {ROLES.map(r => (
              <button
                key={r.value}
                type="button"
                className={`role-btn ${role === r.value ? 'role-btn--active' : ''}`}
                onClick={() => setRole(r.value)}
              >
                <span className="role-btn-icon">{r.label.split(' ')[0]}</span>
                <span className="role-btn-text">{r.label.split(' ').slice(1).join(' ')}</span>
              </button>
            ))}
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
          <div className="form-group">
            <label>{isStudent ? 'Roll Number' : 'ID'}</label>
            <input
              type="text"
              name="rollNo"
              placeholder={
                isStudent ? 'e.g. 23bec083'
                : role === 'vendor' ? 'VENDOR_no.'
                : 'Incharge_Hostel'
              }
              value={form.rollNo}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}