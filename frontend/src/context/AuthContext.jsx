import { createContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('novacart_user') || sessionStorage.getItem('novacart_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const hydrate = async () => {
      const token = localStorage.getItem('novacart_token') || sessionStorage.getItem('novacart_token');
      if (!token) {
        setIsBootstrapping(false);
        return;
      }
      try {
        const response = await API.get('/auth/profile');
        setUser(response.data.user);
      } catch {
        localStorage.removeItem('novacart_user');
        localStorage.removeItem('novacart_token');
        sessionStorage.removeItem('novacart_user');
        sessionStorage.removeItem('novacart_token');
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    };
    hydrate();
  }, []);

  const persistSession = (currentUser, token, rememberMe = true) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    const otherStorage = rememberMe ? sessionStorage : localStorage;
    otherStorage.removeItem('novacart_user');
    otherStorage.removeItem('novacart_token');
    storage.setItem('novacart_user', JSON.stringify(currentUser));
    storage.setItem('novacart_token', token);
    setUser(currentUser);
  };

  const login = async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    const { user: currentUser, token } = response.data;
    persistSession(currentUser, token, credentials.rememberMe);
    toast.success('Welcome back');
    navigate('/home');
  };

  const register = async (data) => {
    const response = await API.post('/auth/register', data);
    const { user: currentUser, token } = response.data;
    persistSession(currentUser, token, true);
    toast.success('Account created');
    navigate('/verify-email');
  };

  const refreshProfile = async () => {
    const response = await API.get('/auth/profile');
    setUser(response.data.user);
    const storage = localStorage.getItem('novacart_token') ? localStorage : sessionStorage;
    storage.setItem('novacart_user', JSON.stringify(response.data.user));
    return response.data.user;
  };

  const updateProfile = async (data) => {
    const response = await API.put('/auth/profile', data);
    setUser(response.data.user);
    const storage = localStorage.getItem('novacart_token') ? localStorage : sessionStorage;
    storage.setItem('novacart_user', JSON.stringify(response.data.user));
    toast.success('Profile updated');
  };

  const verifyEmail = async () => {
    const response = await API.post('/auth/verify-email');
    setUser(response.data.user);
    const storage = localStorage.getItem('novacart_token') ? localStorage : sessionStorage;
    storage.setItem('novacart_user', JSON.stringify(response.data.user));
    toast.success('Email verified');
    navigate('/home');
  };

  const forgotPassword = async (email) => {
    const response = await API.post('/auth/forgot-password', { email });
    toast.success(response.data.message);
  };

  const addAddress = async (address) => {
    await API.post('/auth/addresses', address);
    await refreshProfile();
    toast.success('Address saved');
  };

  const deleteAddress = async (addressId) => {
    await API.delete(`/auth/addresses/${addressId}`);
    await refreshProfile();
    toast.success('Address removed');
  };

  const oauthLogin = async (provider) => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/auth/${provider}`;
  };

  const logout = () => {
    localStorage.removeItem('novacart_user');
    localStorage.removeItem('novacart_token');
    sessionStorage.removeItem('novacart_user');
    sessionStorage.removeItem('novacart_token');
    setUser(null);
    toast.success('Signed out');
    navigate('/login');
  };

  const value = useMemo(() => ({
    user,
    isBootstrapping,
    login,
    register,
    logout,
    updateProfile,
    verifyEmail,
    forgotPassword,
    addAddress,
    deleteAddress,
    oauthLogin,
    refreshProfile,
  }), [user, isBootstrapping]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
