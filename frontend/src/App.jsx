import { useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import TopNav from './components/TopNav';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import OAuthCallback from './pages/OAuthCallback';
import Dashboard from './pages/Dashboard';
import Wishlist from './pages/Wishlist';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const authRoutes = ['/', '/login', '/register', '/forgot-password', '/oauth/callback'];
  const showNav = user && !authRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen">
      {showNav ? <TopNav /> : null}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/verify-email" element={<ProtectedRoute><VerifyEmail /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/checkout/success" element={<ProtectedRoute><CheckoutSuccess /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
    </div>
  );
}

export default App;
