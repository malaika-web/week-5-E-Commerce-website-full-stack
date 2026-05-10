import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isBootstrapping } = useContext(AuthContext);
  if (isBootstrapping) return <div className="min-h-screen grid place-items-center text-slate-500">Checking admin access...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/home" replace />;
  return children;
};

export default AdminRoute;
