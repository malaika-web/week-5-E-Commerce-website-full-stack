import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import API from '../services/api';
import { CartContext } from '../context/CartContext';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const { fetchCart } = useContext(CartContext);
  const hasConfirmed = useRef(false);
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Finalizing your order...');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setMessage('Missing Stripe checkout session.');
      return;
    }
    if (hasConfirmed.current) return;
    hasConfirmed.current = true;

    const confirmOrder = async () => {
      try {
        await API.post(`/payments/confirm-checkout-session/${sessionId}`);
        await fetchCart();
        setStatus('success');
        setMessage('Payment successful. Your order has been created.');
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Unable to finalize your order.');
      }
    };

    confirmOrder();
  }, [fetchCart, sessionId]);

  return (
    <main className="page-shell grid min-h-[70vh] place-items-center">
      <div className="card-surface max-w-2xl text-center">
        <CheckCircle2 className={`mx-auto ${status === 'error' ? 'text-rose-500' : 'text-emerald-500'}`} size={58} />
        <h1 className="mt-5 text-4xl font-black text-slate-950">{status === 'success' ? 'Order confirmed' : status === 'error' ? 'Checkout needs attention' : 'Almost done'}</h1>
        <p className="mt-3 text-slate-500">{message}</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link className="btn-primary" to="/orders">View orders</Link>
          <Link className="btn-secondary" to="/products">Continue shopping</Link>
        </div>
      </div>
    </main>
  );
};

export default CheckoutSuccess;
