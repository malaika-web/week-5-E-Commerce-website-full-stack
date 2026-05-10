import { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Code2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login, oauthLogin, user } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '', rememberMe: true });
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/home" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.email.includes('@')) {
      toast.error('Enter a valid email');
      return;
    }
    if (!form.password) {
      toast.error('Password is required');
      return;
    }
    setLoading(true);
    try {
      await login(form);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell grid min-h-screen place-items-center">
      <div className="card-surface w-full max-w-xl">
        <Link to="/" className="text-sm font-black text-indigo-600">NovaCart</Link>
        <h1 className="mt-5 text-4xl font-black text-slate-950">Welcome back</h1>
        <p className="mt-3 text-slate-500">Login to access your dashboard, cart, orders, and protected shopping flow.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button className="btn-secondary" type="button" onClick={() => oauthLogin('google')}><Mail size={18} /> Continue with Google</button>
          <button className="btn-secondary" type="button" onClick={() => oauthLogin('github')}><Code2 size={18} /> Continue with GitHub</button>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="label">Email address</label>
            <input className="input-field" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input-field" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Enter your password" />
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <label className="flex items-center gap-2 font-semibold text-slate-600">
              <input type="checkbox" checked={form.rememberMe} onChange={(event) => setForm({ ...form, rememberMe: event.target.checked })} />
              Remember me
            </label>
            <Link className="font-bold text-indigo-600" to="/forgot-password">Forgot Password?</Link>
          </div>
          <button className="btn-primary w-full" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-500">
          New here? <Link className="font-black text-indigo-600" to="/register">Create an account</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
