import { useContext, useState } from 'react';
import { MailCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const VerifyEmail = () => {
  const { user, verifyEmail } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    await verifyEmail();
    setLoading(false);
  };

  return (
    <main className="page-shell grid min-h-screen place-items-center">
      <div className="card-surface max-w-xl text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-indigo-50 text-indigo-600">
          <MailCheck size={32} />
        </div>
        <h1 className="mt-6 text-4xl font-black text-slate-950">Verify your email</h1>
        <p className="mt-3 text-slate-500">We prepared the verification UI for {user?.email}. In production this connects to an email token link.</p>
        <button className="btn-primary mt-8" type="button" onClick={handleVerify} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify and continue'}
        </button>
      </div>
    </main>
  );
};

export default VerifyEmail;
