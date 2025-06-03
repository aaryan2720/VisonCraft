import { Navigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated } from '../services/authService';

const ProtectedRoute = ({ children, allowedEmail }) => {
  const isAuth = isAuthenticated();
  const currentUser = getCurrentUser();

  console.log('Protected Route Check:', {
    isAuth,
    currentUser,
    allowedEmail,
    hasAccess: currentUser?.email === allowedEmail
  });

  if (!isAuth) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (allowedEmail && currentUser?.email !== allowedEmail) {
    console.log('Not authorized, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;