import { Link } from 'react-router-dom';
import './Home.css';

const modules = [
  {
    icon: '🛍️',
    color: '#F5A623',
    bg: '#FFF0DC',
    title: 'Student Marketplace',
    desc: 'Buy, sell & lend lab coats, drafters, books, clothes and more to juniors at fair prices. Reduce waste, save money.',
    to: '/marketplace',
  },
  {
    icon: '🗓️',
    color: '#3B82F6',
    bg: '#EFF6FF',
    title: 'Class Timetable',
    desc: 'View timetables for every branch, year & section with faculty names and room numbers.',
    to: '/timetable',
  },
  {
    icon: '🍽️',
    color: '#4A7C59',
    bg: '#E6F4EA',
    title: 'Hostel Mess Menu',
    desc: 'Daily mess menus for every hostel at a glance. Never wonder what\'s for lunch again.',
    to: '/mess',
  },
  {
    icon: '🍎',
    color: '#D97706',
    bg: '#FEF3C7',
    title: 'Fresh Fruits Delivery',
    desc: 'Subscribe to daily fresh fruit delivery right to your hostel every morning from verified vendors.',
    to: '/fruits',
  },
  {
    icon: '🎉',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    title: 'Society & Events',
    desc: 'Discover upcoming events from every college society. Never miss a fest, workshop or competition.',
    to: '/events',
  },
  {
    icon: '📅',
    color: '#0891B2',
    bg: '#ECFEFF',
    title: 'Academic Calendar',
    desc: 'Semester schedule, holidays, exam dates — your entire academic year mapped out clearly.',
    to: '/holidays',
  },
  {
    icon: '🔍',
    color: '#EA580C',
    bg: '#FFF7ED',
    title: 'Lost & Found',
    desc: 'Lost something on campus? Found an item? Post it here and help fellow NITHians reconnect with their belongings.',
    to: '/lost-found',
  },
];

const stats = [
  { value: '6+', label: 'Modules' },
  { value: '₹0', label: 'Platform Fee' },
  { value: '24/7', label: 'Access' },
];

export default function Home() {
  return (
    <div className="home">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__badge">
            <span>✦</span> Built for students, by students
          </div>

          <h1 className="hero__title">
            Your Campus,{' '}
            <span className="hero__title-accent">One Platform</span>
          </h1>

          <p className="hero__sub">
            Buy, sell & lend lab coats, drafters, and more. Check timetables, mess menus,
            events — everything a university student needs in one place.
          </p>

          <div className="hero__cta">
            <Link to="/signup" className="hero__btn-primary">
              Get Started →
            </Link>
            <Link to="/marketplace" className="hero__btn-secondary">
              Explore Features
            </Link>
          </div>

          {/* Stats */}
          <div className="hero__stats">
            {stats.map(s => (
              <div key={s.label} className="hero__stat">
                <span className="hero__stat-value">{s.value}</span>
                <span className="hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative grain texture feel */}
        <div className="hero__grain" aria-hidden />
      </section>

      {/* ── Modules grid ── */}
      <section className="modules">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Everything you need,{' '}
              <span className="section-title-accent">one tap away</span>
            </h2>
            <p className="section-sub">
              Seven powerful modules designed to simplify your campus life from day one.
            </p>
          </div>

          <div className="modules__grid">
            {modules.map(m => (
              <Link to={m.to} key={m.title} className="module-card">
                <div className="module-card__icon" style={{ background: m.bg }}>
                  <span style={{ fontSize: 24 }}>{m.icon}</span>
                </div>
                <h3 className="module-card__title">{m.title}</h3>
                <p className="module-card__desc">{m.desc}</p>
                <span className="module-card__arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <h2 className="cta-banner__title">Ready to simplify your campus life?</h2>
          <p className="cta-banner__sub">
            Join hundreds of students already saving money and time with CampusHub.
          </p>
          <Link to="/signup" className="cta-banner__btn">
            Join CampusHub — It's Free
          </Link>
        </div>
      </section>

    </div>
  );
}
