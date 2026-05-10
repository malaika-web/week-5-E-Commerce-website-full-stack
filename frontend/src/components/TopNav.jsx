import { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Heart, LayoutDashboard, LogOut, Menu, Search, ShoppingBag, Shield, User, X } from 'lucide-react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const TopNav = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      const response = await API.get(`/products/search/suggestions?q=${encodeURIComponent(query)}`);
      setSuggestions(response.data);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    setSuggestions([]);
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  const links = [
    ['Home', '/home'],
    ['Shop', '/products'],
    ['Wishlist', '/wishlist'],
    ['Orders', '/orders'],
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/home" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 font-black text-white">N</span>
          <span className="text-xl font-black tracking-tight text-slate-950">NovaCart</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map(([label, href]) => (
            <NavLink key={href} to={href} className={({ isActive }) => `text-sm font-bold ${isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-950'}`}>
              {label}
            </NavLink>
          ))}
          {user?.role === 'admin' ? (
            <NavLink to="/admin" className={({ isActive }) => `text-sm font-bold ${isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-950'}`}>
              Admin
            </NavLink>
          ) : null}
        </nav>

        <div className="hidden flex-1 justify-center lg:flex">
          <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="input-field rounded-full pl-11" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, brands, categories" />
            {suggestions.length > 0 ? (
              <div className="absolute left-0 right-0 top-14 z-50 rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl">
                {suggestions.map((item) => (
                  <button key={item._id} type="button" onClick={() => navigate(`/products/${item._id}`)} className="flex w-full items-center gap-3 rounded-2xl p-3 text-left hover:bg-slate-50">
                    <img src={item.image} alt={item.title} className="h-11 w-11 rounded-xl object-cover" />
                    <span className="flex-1">
                      <span className="block font-bold text-slate-900">{item.title}</span>
                      <span className="text-xs text-slate-500">{item.category}</span>
                    </span>
                    <span className="font-black">${item.price}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </form>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <button className="icon-btn" type="button" onClick={() => navigate('/wishlist')} aria-label="Wishlist"><Heart size={18} /></button>
          <button className="icon-btn relative" type="button" onClick={() => navigate('/cart')} aria-label="Cart">
            <ShoppingBag size={18} />
            {cart?.products?.length ? <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-indigo-600 text-xs font-black text-white">{cart.products.length}</span> : null}
          </button>
          <button className="icon-btn" type="button" onClick={() => navigate('/dashboard')} aria-label="Dashboard"><User size={18} /></button>
          {user?.role === 'admin' ? <button className="icon-btn" type="button" onClick={() => navigate('/admin')} aria-label="Admin"><Shield size={18} /></button> : null}
          <button className="btn-secondary px-4 py-2.5" type="button" onClick={logout}><LogOut size={17} /> Logout</button>
        </div>

        <button className="icon-btn lg:hidden" type="button" onClick={() => setOpen((value) => !value)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white px-4 py-5 lg:hidden">
          <form onSubmit={handleSearch} className="mb-4">
            <input className="input-field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />
          </form>
          <div className="grid gap-2">
            {links.map(([label, href]) => (
              <Link key={href} to={href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 font-bold text-slate-700 hover:bg-slate-50">{label}</Link>
            ))}
            <Link to="/dashboard" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 font-bold text-slate-700 hover:bg-slate-50"><LayoutDashboard className="mr-2 inline" size={18} /> Dashboard</Link>
            {user?.role === 'admin' ? <Link to="/admin" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 font-bold text-slate-700 hover:bg-slate-50">Admin</Link> : null}
            <button className="rounded-2xl px-4 py-3 text-left font-bold text-rose-600 hover:bg-rose-50" type="button" onClick={logout}>Logout</button>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default TopNav;
