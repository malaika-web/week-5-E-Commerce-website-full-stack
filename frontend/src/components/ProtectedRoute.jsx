import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isBootstrapping } = useContext(AuthContext);
  if (isBootstrapping) {
    return <div className="min-h-screen grid place-items-center text-slate-500">Securing your session...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
