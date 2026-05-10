import { useContext, useEffect, useState } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const OrderHistory = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    API.get('/orders').then((response) => setOrders(response.data)).finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="page-shell py-20 text-center">Loading orders...</div>;

  return (
    <main className="page-shell section-space">
      <div className="mb-8">
        <p className="eyebrow">Purchases</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Order history</h1>
      </div>
      {orders.length === 0 ? (
        <div className="card-surface text-center">
          <h2 className="text-2xl font-black">No orders yet</h2>
          <p className="mt-2 text-slate-500">Your completed Stripe and COD orders will show here.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <article key={order._id} className="card-surface">
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <h2 className="text-xl font-black">Order #{order._id.slice(-8)}</h2>
                  <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()} · {order.paymentMethod?.toUpperCase()} · {order.paymentStatus}</p>
                </div>
                <div className="text-left md:text-right">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black uppercase text-indigo-600">{order.status}</span>
                  <p className="mt-2 text-2xl font-black">${order.totalPrice.toFixed(2)}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {order.products.map((item) => (
                  <div key={item.product?._id || item._id} className="panel-soft flex items-center gap-3">
                    <img src={item.product?.image || 'https://placehold.co/200'} alt={item.product?.title || 'Product'} className="h-14 w-14 rounded-xl object-cover" />
                    <span className="flex-1"><span className="block font-black">{item.product?.title || 'Product removed'}</span><span className="text-sm text-slate-500">Qty {item.quantity}</span></span>
                    <span className="font-black">${(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default OrderHistory;
