import { useContext } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import { FavoriteContext } from '../context/FavoriteContext';

const Wishlist = () => {
  const { favorites, isLoading } = useContext(FavoriteContext);

  if (isLoading) return <main className="page-shell section-space"><ProductGridSkeleton /></main>;

  return (
    <main className="page-shell section-space">
      <div className="mb-8">
        <p className="eyebrow">Saved Products</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Wishlist</h1>
      </div>
      {favorites.length === 0 ? (
        <div className="card-surface text-center">
          <h2 className="text-2xl font-black">Your wishlist is empty</h2>
          <p className="mt-2 text-slate-500">Save products to sync them with your account.</p>
          <Link className="btn-primary mt-6" to="/products">Browse products</Link>
        </div>
      ) : (
        <div className="grid-responsive">
          {favorites.filter((fav) => fav.productId).map((fav) => <ProductCard key={fav._id} product={fav.productId} />)}
        </div>
      )}
    </main>
  );
};

export default Wishlist;
