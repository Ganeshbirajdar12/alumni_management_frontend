import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Not logged in → redirect to landing
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If roles specified, check user's role
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.user?.role;
    if (!allowedRoles.includes(userRole)) {
      // Not authorized → send them to the right dashboard
      if (userRole === 'ROLE_SUPER_ADMIN' || userRole === 'ROLE_ADMIN') {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;