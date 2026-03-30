import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Timetable from './pages/Timetable';
import Events from './pages/Events';

import './styles/globals.css';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminEvents from './pages/AdminEvents';
import MessMenu from './pages/MessMenu';
import FruitsGrocery from "./pages/FruitsGrocery";
import FruitsAdmin from "./pages/FruitsAdmin";

// Placeholder pages — build these next
function ComingSoon({ title }) {
  return (
    <div style={{ padding: '80px 24px', textAlign: 'center' }}>
      <p style={{ fontSize: 48, marginBottom: 16 }}>🚧</p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--espresso)', marginBottom: 8 }}>
        {title}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>Coming soon — this page is in progress.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/timetable"   element={<Timetable />} />
        <Route path="/events"      element={<Events />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/mess" element={<MessMenu />} />
        <Route path="/fruits" element={<FruitsGrocery />} />
        <Route path="/fruits/admin" element={<FruitsAdmin />} />
        <Route path="/calendar"    element={<ComingSoon title="Academic Calendar" />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/signup" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
