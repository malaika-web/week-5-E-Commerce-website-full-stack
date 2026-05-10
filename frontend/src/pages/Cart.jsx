import { useContext, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { CartContext } from '../context/CartContext';

const coupons = { NOVA10: 0.1, WELCOME15: 0.15 };

const Cart = () => {
  const { cart, isLoading, updateCartItem, removeCartItem } = useContext(CartContext);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  const subtotal = useMemo(() => cart?.products?.reduce((sum, item) => sum + item.quantity * item.product.price, 0) || 0, [cart]);
  const total = subtotal - subtotal * discount;

  const applyCoupon = () => {
    const value = coupons[coupon.trim().toUpperCase()];
    if (!value) return toast.error('Invalid coupon');
    setDiscount(value);
    toast.success(`${Math.round(value * 100)}% discount applied`);
  };

  if (isLoading) return <div className="page-shell py-20 text-center">Loading cart...</div>;
  if (!cart || cart.products.length === 0) {
    return (
      <main className="page-shell section-space text-center">
        <div className="card-surface">
          <h2 className="text-3xl font-black text-slate-950">Your cart is empty</h2>
          <p className="mt-2 text-slate-500">Add products before checkout.</p>
          <Link className="btn-primary mt-6" to="/products">Continue shopping</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell section-space">
      <h1 className="mb-8 text-4xl font-black text-slate-950">Shopping cart</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
        <section className="space-y-4">
          {cart.products.map((item) => (
            <div key={item.product._id} className="card-surface flex flex-col gap-4 sm:flex-row sm:items-center">
              <img src={item.product.image} alt={item.product.title} className="h-28 w-28 rounded-3xl object-cover" />
              <div className="flex-1">
                <h2 className="text-xl font-black">{item.product.title}</h2>
                <p className="text-sm text-slate-500">{item.product.category}</p>
                <p className="mt-2 font-black">${item.product.price}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="icon-btn" type="button" onClick={() => updateCartItem(item.product._id, Math.max(1, item.quantity - 1))}><Minus size={16} /></button>
                <span className="w-8 text-center font-black">{item.quantity}</span>
                <button className="icon-btn" type="button" onClick={() => updateCartItem(item.product._id, item.quantity + 1)}><Plus size={16} /></button>
                <button className="icon-btn text-rose-600" type="button" onClick={() => removeCartItem(item.product._id)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </section>
        <aside className="card-surface h-fit">
          <h2 className="text-2xl font-black">Order summary</h2>
          <div className="mt-6 space-y-3 text-slate-600">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Discount</span><span>-${(subtotal * discount).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
            <div className="border-t border-slate-200 pt-4 flex justify-between text-xl font-black text-slate-950"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <div className="mt-6 flex gap-2">
            <input className="input-field" value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="NOVA10" />
            <button className="btn-secondary px-4" type="button" onClick={applyCoupon}>Apply</button>
          </div>
          <button className="btn-primary mt-6 w-full" type="button" onClick={() => navigate('/checkout')}>Checkout</button>
        </aside>
      </div>
    </main>
  );
};

export default Cart;
