import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgePercent, Quote, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const response = await API.get('/products?limit=9&sort=popular');
      setProducts(response.data);
      setLoading(false);
    };
    load();
  }, []);

  const categories = [...new Set(products.map((product) => product.category))].slice(0, 6);

  return (
    <main>
      <section className="page-shell section-space grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div className="eyebrow">Welcome, {user?.name?.split(' ')[0] || 'shopper'}</div>
          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.02] text-slate-950 lg:text-7xl">
            Premium shopping, fast checkout, and smart discovery.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Explore featured products, trending drops, flash sales, wishlist sync, and a complete checkout workflow.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="btn-primary" to="/products">Start shopping <ArrowRight size={18} /></Link>
            <Link className="btn-secondary" to="/dashboard">Open dashboard</Link>
          </div>
        </motion.div>
        <div className="card-surface p-4">
          <img
            src={products[0]?.image || 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80'}
            alt="Featured product"
            className="aspect-[5/4] w-full rounded-[1.5rem] object-cover"
          />
        </div>
      </section>

      <section className="page-shell grid gap-4 sm:grid-cols-3">
        {[[Truck, 'Free shipping', 'On qualifying orders'], [ShieldCheck, 'Secure payments', 'Stripe hosted checkout'], [BadgePercent, 'Flash deals', 'Coupons and COD available']].map(([Icon, title, copy]) => (
          <div key={title} className="panel-soft flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><Icon size={22} /></span>
            <span><span className="block font-black">{title}</span><span className="text-sm text-slate-500">{copy}</span></span>
          </div>
        ))}
      </section>

      <section className="page-shell section-space">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Categories</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Shop by collection</h2>
          </div>
          <Link to="/products" className="font-black text-indigo-600">View all</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link key={category} to={`/products?category=${encodeURIComponent(category)}`} className="panel-soft text-center font-black hover:border-indigo-200 hover:text-indigo-600">
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="page-shell">
        <div className="mb-8">
          <p className="eyebrow">Featured Products</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Trending now</h2>
        </div>
        {loading ? <ProductGridSkeleton /> : <div className="grid-responsive">{products.slice(0, 6).map((product) => <ProductCard key={product._id} product={product} />)}</div>}
      </section>

      <section className="page-shell section-space grid gap-8 lg:grid-cols-2">
        <div className="card-surface bg-slate-950 text-white">
          <p className="eyebrow text-teal-300">Flash Sale</p>
          <h2 className="mt-3 text-4xl font-black">Use code NOVA10 for 10% off</h2>
          <p className="mt-4 text-slate-300">The cart validates coupon UI and updates the order summary instantly.</p>
          <Link className="btn-primary mt-8 bg-white text-slate-950 hover:bg-indigo-100" to="/cart">Go to cart</Link>
        </div>
        <div className="card-surface">
          <Quote className="text-indigo-600" />
          <p className="mt-5 text-xl font-semibold leading-8 text-slate-700">NovaCart feels like a real retail product now: protected account flow, sharp discovery, wishlist sync, and checkout choices that make sense.</p>
          <p className="mt-5 font-black text-slate-950">Ayesha Khan, Product Lead</p>
        </div>
      </section>

      <section className="page-shell pb-16">
        <div className="card-surface flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="eyebrow">Newsletter</p>
            <h2 className="mt-2 text-3xl font-black">Get new arrivals before everyone else</h2>
          </div>
          <div className="flex w-full gap-3 md:w-auto">
            <input className="input-field min-w-0 md:w-80" placeholder="Email address" />
            <button className="btn-primary" type="button">Subscribe</button>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/70 bg-white/60">
        <div className="page-shell flex flex-col justify-between gap-4 py-8 md:flex-row">
          <p className="font-black">NovaCart</p>
          <p className="text-sm text-slate-500">MERN commerce with JWT auth, admin, wishlist, cart, COD, and Stripe structure.</p>
        </div>
      </footer>
    </main>
  );
};

export default Home;
