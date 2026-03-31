import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Not logged in → go to login
  if (!user) return <Navigate to="/login" replace />;

  // Logged in, roles specified, but role not allowed → go home
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  // Logged in, no role restriction OR role matches → allow
  return children;
};

export default ProtectedRoute;