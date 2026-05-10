import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Banknote, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
  const { cart, fetchCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [shippingAddress, setShippingAddress] = useState(user?.addresses?.find((address) => address.isDefault)?.line1 || '');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const total = useMemo(() => cart?.products?.reduce((sum, item) => sum + item.quantity * item.product.price, 0) || 0, [cart]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!shippingAddress.trim()) return toast.error('Shipping address is required');
    setIsSubmitting(true);
    try {
      if (paymentMethod === 'cod') {
        await API.post('/orders', { shippingAddress, paymentMethod: 'cod' });
        await fetchCart();
        toast.success('COD order placed');
        navigate('/orders');
        return;
      }
      const response = await API.post('/payments/create-checkout-session', { shippingAddress });
      window.location.assign(response.data.url);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cart || cart.products.length === 0) {
    return (
      <main className="page-shell section-space text-center">
        <div className="card-surface">
          <h2 className="text-3xl font-black">No items in checkout</h2>
          <p className="mt-2 text-slate-500">Add products before placing an order.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell section-space">
      <h1 className="mb-8 text-4xl font-black text-slate-950">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_24rem]">
        <section className="card-surface space-y-7">
          <div>
            <label className="label">Shipping address</label>
            <textarea className="input-field min-h-32 resize-none" value={shippingAddress} onChange={(event) => setShippingAddress(event.target.value)} placeholder="House, street, city, postal code" />
          </div>
          <div>
            <label className="label">Payment method</label>
            <div className="grid gap-4 sm:grid-cols-2">
              <button type="button" onClick={() => setPaymentMethod('stripe')} className={`panel-soft text-left ${paymentMethod === 'stripe' ? 'border-indigo-400 ring-4 ring-indigo-100' : ''}`}>
                <CreditCard className="text-indigo-600" />
                <span className="mt-3 block font-black">Stripe Checkout</span>
                <span className="text-sm text-slate-500">Secure hosted card payment</span>
              </button>
              <button type="button" onClick={() => setPaymentMethod('cod')} className={`panel-soft text-left ${paymentMethod === 'cod' ? 'border-indigo-400 ring-4 ring-indigo-100' : ''}`}>
                <Banknote className="text-emerald-600" />
                <span className="mt-3 block font-black">Cash on Delivery</span>
                <span className="text-sm text-slate-500">Pay when your order arrives</span>
              </button>
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-xl font-black">Order items</h2>
            <div className="space-y-3">
              {cart.products.map((item) => (
                <div key={item.product._id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-3">
                  <span className="font-bold">{item.product.title} x {item.quantity}</span>
                  <span className="font-black">${(item.quantity * item.product.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <aside className="card-surface h-fit">
          <h2 className="text-2xl font-black">Summary</h2>
          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
            <div className="flex justify-between text-slate-600"><span>Shipping</span><span>Free</span></div>
            <div className="border-t border-slate-200 pt-4 flex justify-between text-xl font-black"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <button className="btn-primary mt-6 w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : paymentMethod === 'cod' ? 'Place COD order' : `Pay $${total.toFixed(2)}`}
          </button>
        </aside>
      </form>
    </main>
  );
};

export default Checkout;
