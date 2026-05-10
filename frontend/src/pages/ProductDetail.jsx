import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../services/api';
import { CartContext } from '../context/CartContext';
import { FavoriteContext } from '../context/FavoriteContext';
import Skeleton from '../components/Skeleton';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);
  const { toggleFavorite, isFavorite } = useContext(FavoriteContext);

  useEffect(() => {
    const loadProduct = async () => {
      const response = await API.get(`/products/${id}`);
      setProduct(response.data);
      const current = JSON.parse(localStorage.getItem('novacart_recent') || '[]');
      const next = [response.data, ...current.filter((item) => item._id !== response.data._id)].slice(0, 8);
      localStorage.setItem('novacart_recent', JSON.stringify(next.map((item) => ({ _id: item._id, title: item.title, image: item.image }))));
      const relatedResponse = await API.get(`/products?category=${encodeURIComponent(response.data.category)}&limit=3`);
      setRelated(relatedResponse.data.filter((item) => item._id !== id));
    };
    loadProduct();
  }, [id]);

  if (!product) {
    return <main className="page-shell section-space"><Skeleton className="h-[32rem] w-full" /></main>;
  }

  const liked = isFavorite(product._id);

  const handleCart = async () => {
    await addToCart(product._id, quantity);
    toast.success('Added to cart');
  };

  const handleWishlist = async () => {
    await toggleFavorite(product._id);
    toast.success(liked ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  return (
    <main className="page-shell section-space">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="card-surface p-4">
          <img src={product.image} alt={product.title} className="aspect-square w-full rounded-[1.5rem] object-cover" loading="lazy" onError={(event) => { event.currentTarget.src = 'https://placehold.co/900x900/e2e8f0/0f172a?text=NovaCart'; }} />
        </div>
        <section className="card-surface">
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-3 text-4xl font-black text-slate-950 lg:text-5xl">{product.title}</h1>
          <div className="mt-4 flex items-center gap-2 text-amber-500">
            {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={18} fill="currentColor" />)}
            <span className="ml-2 text-sm font-bold text-slate-500">{product.rating || 4.7} rating</span>
          </div>
          <p className="mt-6 text-lg leading-8 text-slate-600">{product.description}</p>
          <div className="mt-8 flex items-end justify-between rounded-3xl bg-slate-50 p-5">
            <div>
              <p className="text-sm font-bold text-slate-500">Price</p>
              <p className="text-4xl font-black text-slate-950">${Number(product.price).toFixed(2)}</p>
            </div>
            <p className={product.stock > 0 ? 'font-bold text-emerald-600' : 'font-bold text-rose-600'}>{product.stock} in stock</p>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <span className="font-black">Quantity</span>
            <div className="flex items-center rounded-full border border-slate-200 bg-white">
              <button className="icon-btn border-0" type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button>
              <span className="w-10 text-center font-black">{quantity}</span>
              <button className="icon-btn border-0" type="button" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}><Plus size={16} /></button>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="btn-primary flex-1" type="button" onClick={handleCart}><ShoppingBag size={18} /> Add to cart</button>
            <button className="btn-secondary" type="button" onClick={handleWishlist}><Heart size={18} fill={liked ? 'currentColor' : 'none'} /> Wishlist</button>
            <Link className="btn-secondary" to="/checkout">Buy now</Link>
          </div>
        </section>
      </div>

      {related.length ? (
        <section className="mt-12">
          <h2 className="text-2xl font-black text-slate-950">Related products</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item._id} to={`/products/${item._id}`} className="panel-soft flex items-center gap-4">
                <img src={item.image} alt={item.title} className="h-16 w-16 rounded-2xl object-cover" />
                <span><span className="block font-black">{item.title}</span><span className="text-sm text-slate-500">${item.price}</span></span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
};

export default ProductDetail;
