import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const ForgotPassword = () => {
  const { forgotPassword } = useContext(AuthContext);
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.includes('@')) return toast.error('Enter a valid email');
    await forgotPassword(email);
  };

  return (
    <main className="page-shell grid min-h-screen place-items-center">
      <div className="card-surface w-full max-w-lg">
        <h1 className="text-4xl font-black text-slate-950">Reset password</h1>
        <p className="mt-3 text-slate-500">This UI is ready for an email provider. The backend returns a safe generic response.</p>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="label">Email address</label>
            <input className="input-field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          </div>
          <button className="btn-primary w-full" type="submit">Send reset link</button>
        </form>
        <Link className="mt-6 inline-block font-bold text-indigo-600" to="/login">Back to login</Link>
      </div>
    </main>
  );
};

export default ForgotPassword;
