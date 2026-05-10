import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { FavoriteContext } from '../context/FavoriteContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { toggleFavorite, isFavorite } = useContext(FavoriteContext);
  const liked = isFavorite(product._id);

  const handleAddToCart = async () => {
    await addToCart(product._id);
    toast.success('Added to cart');
  };

  const handleFavorite = async () => {
    await toggleFavorite(product._id);
    toast.success(liked ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="card-surface overflow-hidden p-3"
    >
      <Link to={`/products/${product._id}`} className="block overflow-hidden rounded-[1.35rem] bg-slate-100">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="aspect-[4/3] h-full w-full object-cover transition duration-500 hover:scale-105"
          onError={(event) => { event.currentTarget.src = 'https://placehold.co/800x600/e2e8f0/0f172a?text=NovaCart'; }}
        />
      </Link>
      <div className="p-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
          <span>{product.category}</span>
          <span className="flex items-center gap-1 text-amber-500"><Star size={14} fill="currentColor" /> {product.rating || 4.7}</span>
        </div>
        <Link to={`/products/${product._id}`} className="mt-3 block text-lg font-black text-slate-950 hover:text-indigo-600">
          {product.title}
        </Link>
        <p className="mt-2 line-clamp-2 min-h-12 text-sm text-slate-500">{product.description}</p>
        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="text-2xl font-black text-slate-950">${Number(product.price).toFixed(2)}</p>
            <p className={product.stock > 0 ? 'text-xs text-emerald-600' : 'text-xs text-rose-600'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
          </div>
          <div className="flex gap-2">
            <button className={`icon-btn ${liked ? 'bg-rose-50 text-rose-600' : ''}`} type="button" onClick={handleFavorite} aria-label="Toggle wishlist">
              <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
            </button>
            <button className="icon-btn bg-slate-950 text-white hover:bg-indigo-600" type="button" onClick={handleAddToCart} disabled={product.stock <= 0} aria-label="Add to cart">
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
