import { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const OAuthCallback = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userData = searchParams.get('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userData));
        // Simulate login with OAuth data
        localStorage.setItem('novacart_token', token);
        localStorage.setItem('novacart_user', JSON.stringify(parsedUser));
        toast.success('Welcome!');
        navigate('/home');
      } catch (error) {
        toast.error('OAuth login failed');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <main className="page-shell grid min-h-screen place-items-center">
      <div className="card-surface text-center">
        <h1 className="text-2xl font-black">Completing sign in...</h1>
      </div>
    </main>
  );
};

export default OAuthCallback;