import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, LogOut, MapPin, Package, Settings, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FavoriteContext } from '../context/FavoriteContext';

const Dashboard = () => {
  const { user, logout, updateProfile, addAddress, deleteAddress } = useContext(AuthContext);
  const { favorites } = useContext(FavoriteContext);
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [address, setAddress] = useState({ label: 'Home', line1: '', city: '', phone: '' });

  useEffect(() => {
    API.get('/orders').then((response) => setOrders(response.data));
  }, []);

  const saveProfile = async (event) => {
    event.preventDefault();
    await updateProfile(profile);
  };

  const saveAddress = async (event) => {
    event.preventDefault();
    if (!address.line1) return toast.error('Address line is required');
    await addAddress({ ...address, isDefault: !user?.addresses?.length });
    setAddress({ label: 'Home', line1: '', city: '', phone: '' });
  };

  const recent = JSON.parse(localStorage.getItem('novacart_recent') || '[]');

  return (
    <main className="page-shell section-space">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Account</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">User dashboard</h1>
        </div>
        <button className="btn-secondary" type="button" onClick={logout}><LogOut size={18} /> Logout</button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[[Package, orders.length, 'Orders'], [Heart, favorites.length, 'Wishlist'], [MapPin, user?.addresses?.length || 0, 'Addresses'], [UserRound, user?.isEmailVerified ? 'Verified' : 'Pending', 'Email']].map(([Icon, value, label]) => (
          <div key={label} className="card-surface">
            <Icon className="text-indigo-600" />
            <p className="mt-4 text-3xl font-black">{value}</p>
            <p className="text-sm font-bold text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="card-surface">
          <h2 className="flex items-center gap-2 text-2xl font-black"><UserRound /> Profile</h2>
          <form className="mt-6 space-y-4" onSubmit={saveProfile}>
            <div><label className="label">Name</label><input className="input-field" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></div>
            <div><label className="label">Phone</label><input className="input-field" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} /></div>
            <button className="btn-primary" type="submit">Save profile</button>
          </form>
        </section>

        <section className="card-surface">
          <h2 className="flex items-center gap-2 text-2xl font-black"><Settings /> Settings</h2>
          <div className="mt-6 space-y-3">
            <div className="panel-soft flex items-center justify-between"><span>Email verification</span><span className="font-black">{user?.isEmailVerified ? 'Verified' : 'Pending'}</span></div>
            <div className="panel-soft flex items-center justify-between"><span>Role</span><span className="font-black capitalize">{user?.role}</span></div>
            <Link className="btn-secondary w-full" to="/verify-email">Open verification UI</Link>
          </div>
        </section>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="card-surface">
          <h2 className="flex items-center gap-2 text-2xl font-black"><MapPin /> Saved addresses</h2>
          <form className="mt-6 grid gap-3 sm:grid-cols-2" onSubmit={saveAddress}>
            <input className="input-field" value={address.label} onChange={(event) => setAddress({ ...address, label: event.target.value })} placeholder="Label" />
            <input className="input-field" value={address.phone} onChange={(event) => setAddress({ ...address, phone: event.target.value })} placeholder="Phone" />
            <input className="input-field sm:col-span-2" value={address.line1} onChange={(event) => setAddress({ ...address, line1: event.target.value })} placeholder="Address line" />
            <input className="input-field" value={address.city} onChange={(event) => setAddress({ ...address, city: event.target.value })} placeholder="City" />
            <button className="btn-primary" type="submit">Add address</button>
          </form>
          <div className="mt-5 space-y-3">
            {user?.addresses?.map((item) => (
              <div key={item._id} className="panel-soft flex justify-between gap-4">
                <span><span className="block font-black">{item.label}</span><span className="text-sm text-slate-500">{item.line1}, {item.city}</span></span>
                <button className="font-bold text-rose-600" type="button" onClick={() => deleteAddress(item._id)}>Remove</button>
              </div>
            ))}
          </div>
        </section>

        <section className="card-surface">
          <h2 className="text-2xl font-black">Recently viewed</h2>
          <div className="mt-6 space-y-3">
            {recent.length === 0 ? <p className="text-slate-500">Open product detail pages to build your recent list.</p> : recent.slice(0, 5).map((item) => (
              <Link key={item._id} to={`/products/${item._id}`} className="panel-soft flex items-center gap-3">
                <img src={item.image} alt={item.title} className="h-12 w-12 rounded-xl object-cover" />
                <span className="font-black">{item.title}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="card-surface mt-8">
        <h2 className="text-2xl font-black">Recent orders</h2>
        <div className="mt-5 space-y-3">
          {orders.slice(0, 4).map((order) => (
            <div key={order._id} className="panel-soft flex items-center justify-between">
              <span><span className="block font-black">Order #{order._id.slice(-8)}</span><span className="text-sm text-slate-500">{order.status}</span></span>
              <span className="font-black">${order.totalPrice.toFixed(2)}</span>
            </div>
          ))}
          {orders.length === 0 ? <p className="text-slate-500">No orders yet.</p> : null}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
