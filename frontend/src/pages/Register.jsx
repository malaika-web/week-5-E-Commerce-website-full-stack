import { useContext, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Check, Code2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const rules = [
  ['8+ characters', (value) => value.length >= 8],
  ['Uppercase letter', (value) => /[A-Z]/.test(value)],
  ['Lowercase letter', (value) => /[a-z]/.test(value)],
  ['Number', (value) => /\d/.test(value)],
  ['Symbol', (value) => /[^A-Za-z\d]/.test(value)],
];

const Register = () => {
  const { register, oauthLogin, user } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [suggestedPassword, setSuggestedPassword] = useState('');
  const passwordScore = useMemo(() => rules.filter(([, test]) => test(form.password)).length, [form.password]);

  const generatePassword = (length = 14) => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';
    const all = upper + lower + numbers + symbols;
    let password = '';

    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = password.length; i < length; i += 1) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  };

  if (user) return <Navigate to="/home" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) return toast.error('Full name is required');
    if (!form.email.includes('@')) return toast.error('Enter a valid email');
    if (!form.password) return toast.error('Password is required');
    if (!form.confirmPassword) return toast.error('Confirm your password');
    if (passwordScore < rules.length) return toast.error('Password is not strong enough');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
    } catch (err) {
      console.error('Register error:', err);
      toast.error(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell grid min-h-screen place-items-center">
      <div className="card-surface w-full max-w-2xl">
        <Link to="/" className="text-sm font-black text-indigo-600">NovaCart</Link>
        <h1 className="mt-5 text-4xl font-black text-slate-950">Create your account</h1>
        <p className="mt-3 text-slate-500">Register first, verify your email UI, then enter the shopping dashboard.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button className="btn-secondary" type="button" onClick={() => oauthLogin('google')}><Mail size={18} /> Continue with Google</button>
          <button className="btn-secondary" type="button" onClick={() => oauthLogin('github')}><Code2 size={18} /> Continue with GitHub</button>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label">Full name</label>
              <input className="input-field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" />
            </div>
            <div>
              <label className="label">Email address</label>
              <input className="input-field" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label">Password</label>
              <input className="input-field" type="password" value={form.password} onChange={(event) => {
                setForm({ ...form, password: event.target.value });
                setSuggestedPassword('');
              }} />
              <button
                className="btn-secondary mt-3 w-full text-sm"
                type="button"
                onClick={() => {
                  const strongPassword = generatePassword();
                  setForm({ ...form, password: strongPassword, confirmPassword: strongPassword });
                  setSuggestedPassword(strongPassword);
                  toast.success('Strong password suggested');
                }}
              >
                Suggest a strong password
              </button>
              {suggestedPassword && (
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  <div className="font-semibold">Suggested password</div>
                  <div className="mt-2 break-all select-all">{suggestedPassword}</div>
                </div>
              )}
            </div>
            <div>
              <label className="label">Confirm password</label>
              <input className="input-field" type="password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} />
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {rules.map(([label, test]) => (
              <div key={label} className={`flex items-center gap-2 text-sm font-semibold ${test(form.password) ? 'text-emerald-600' : 'text-slate-400'}`}>
                <Check size={16} /> {label}
              </div>
            ))}
          </div>
          <button className="btn-primary w-full" type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account? <Link className="font-black text-indigo-600" to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
