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
import ProtectedRoute from "./components/ProtectedRoute";
import FruitsAdmin from "./pages/FruitsAdmin";
import Holidays from "./pages/Holidays";
import LostFound from './pages/LostFound';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ScrollToTop />

      <Routes>
        {/* ── PUBLIC ── */}
        <Route path="/"       element={<Home />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Register />} />

        {/* ── PROTECTED (any logged-in user) ── */}
        <Route path="/marketplace" element={
          <ProtectedRoute><Marketplace /></ProtectedRoute>
        } />
        <Route path="/timetable" element={
          <ProtectedRoute><Timetable /></ProtectedRoute>
        } />
        <Route path="/events" element={
          <ProtectedRoute><Events /></ProtectedRoute>
        } />
        <Route path="/mess" element={
          <ProtectedRoute><MessMenu /></ProtectedRoute>
        } />
        <Route path="/fruits" element={
          <ProtectedRoute><FruitsGrocery /></ProtectedRoute>
        } />
        <Route path="/holidays" element={
          <ProtectedRoute><Holidays /></ProtectedRoute>
        } />
        <Route path="/lost-found" element={
          <ProtectedRoute><LostFound /></ProtectedRoute>
        } />

        {/* ── PROTECTED (role-restricted) ── */}
        <Route path="/admin/events" element={
          <ProtectedRoute allowedRoles={['admin', 'society']}>
            <AdminEvents />
          </ProtectedRoute>
        } />
        <Route path="/fruits/admin" element={
          <ProtectedRoute allowedRoles={['vendor', 'admin']}>
            <FruitsAdmin />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}