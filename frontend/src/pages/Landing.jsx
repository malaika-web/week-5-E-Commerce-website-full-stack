import { Link, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Truck, Star, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Landing = () => {
  const { user } = useContext(AuthContext);
  if (user) return <Navigate to="/home" replace />;

  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative page-shell grid min-h-screen items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="eyebrow mb-6">Premium E-Commerce Platform</div>
          <h1 className="mb-8 max-w-4xl text-6xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-7xl lg:text-8xl">
            Shop with
            <span className="hero-gradient block">confidence</span>
            and style
          </h1>
          <p className="mb-10 max-w-2xl text-xl leading-8 text-slate-600">
            NovaCart delivers a complete shopping experience with secure payments, wishlist sync, admin management, and a checkout flow that feels like premium retail.
          </p>
          <div className="mb-12 flex flex-col gap-4 sm:flex-row">
            <Link to="/register" className="btn-primary text-lg">
              Start Shopping <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn-secondary text-lg">
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              [ShieldCheck, '100% Secure', 'Protected payments'],
              [Truck, 'Free Shipping', 'On orders over $50'],
              [Sparkles, 'Premium UX', 'Modern design'],
            ].map(([Icon, title, subtitle]) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="panel-soft flex items-center gap-4"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                  <Icon size={24} />
                </div>
                <div>
                  <p className="font-black text-slate-900">{title}</p>
                  <p className="text-sm text-slate-500">{subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Background Effects */}
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-400/30 to-purple-500/30 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-gradient-to-br from-teal-400/25 to-cyan-500/25 blur-3xl" />

          <div className="glass-card relative premium-shadow">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
              alt="Premium shopping experience"
              className="aspect-[4/5] w-full rounded-2xl object-cover shadow-2xl"
            />
            <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/30 bg-white/20 p-6 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-emerald-500" size={24} />
                <div>
                  <p className="font-black text-slate-950">Ready to shop</p>
                  <p className="text-sm text-slate-600">Secure login required for access</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="page-shell section-space">
        <div className="text-center mb-16">
          <p className="eyebrow mb-4">Why Choose NovaCart</p>
          <h2 className="text-4xl font-black text-slate-950 lg:text-5xl">
            Everything you need for modern e-commerce
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Users,
              title: 'User Management',
              description: 'Complete user profiles, addresses, order history, and secure authentication with OAuth support.',
            },
            {
              icon: Award,
              title: 'Admin Dashboard',
              description: 'Full admin panel for product management, user oversight, analytics, and inventory control.',
            },
            {
              icon: Star,
              title: 'Wishlist & Cart',
              description: 'Persistent wishlist sync, smart cart management, and seamless checkout experience.',
            },
            {
              icon: ShieldCheck,
              title: 'Secure Payments',
              description: 'Stripe integration with COD options, coupon system, and comprehensive order tracking.',
            },
            {
              icon: Sparkles,
              title: 'Modern UI/UX',
              description: 'Premium design with animations, responsive layouts, and professional user experience.',
            },
            {
              icon: Truck,
              title: 'Order Management',
              description: 'Complete order lifecycle from placement to delivery with real-time status updates.',
            },
          ].map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="card-surface text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl">
                <Icon size={32} />
              </div>
              <h3 className="mb-4 text-2xl font-black text-slate-950">{title}</h3>
              <p className="text-slate-600">{description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="page-shell pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="card-surface bg-gradient-to-br from-slate-900 to-slate-800 text-center text-white"
        >
          <h2 className="mb-6 text-4xl font-black lg:text-5xl">
            Ready to experience premium shopping?
          </h2>
          <p className="mb-8 text-xl text-slate-300">
            Join thousands of satisfied customers shopping with confidence.
          </p>
          <Link to="/register" className="btn-primary bg-white text-slate-900 hover:bg-slate-50">
            Get Started Now <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>
    </main>
  );
};

export default Landing;
