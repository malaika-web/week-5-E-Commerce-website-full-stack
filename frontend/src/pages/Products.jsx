import { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';

const useQuery = () => new URLSearchParams(useLocation().search);

const Products = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ categories: [], priceRange: { min: 0, max: 5000 } });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: query.get('search') || '',
    category: query.get('category') || '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
  });

  useEffect(() => {
    API.get('/products/meta/options').then((response) => setMeta(response.data));
  }, []);

  useEffect(() => {
    const next = { ...filters, search: query.get('search') || '', category: query.get('category') || '' };
    setFilters((current) => ({ ...current, search: next.search, category: next.category }));
  }, [query.get('search'), query.get('category')]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const response = await API.get(`/products?${params.toString()}`);
      setProducts(response.data);
      setLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [filters]);

  const hasFilters = useMemo(() => Object.values(filters).some(Boolean), [filters]);

  const update = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    const params = new URLSearchParams();
    if (next.search) params.set('search', next.search);
    if (next.category) params.set('category', next.category);
    navigate(`/products?${params.toString()}`, { replace: true });
  };

  return (
    <main className="page-shell section-space">
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow">Smart Search</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Find your next product</h1>
          <p className="mt-3 text-slate-500">Real-time search, category filtering, price range, and sorting are connected to the backend API.</p>
        </div>
        {hasFilters ? <button className="btn-secondary" type="button" onClick={() => setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: 'newest' })}>Clear filters</button> : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <aside className="card-surface h-fit">
          <div className="flex items-center gap-2 text-lg font-black"><SlidersHorizontal size={20} /> Filters</div>
          <div className="mt-6 space-y-5">
            <div>
              <label className="label">Search</label>
              <input className="input-field" value={filters.search} onChange={(event) => update('search', event.target.value)} placeholder="Search products" />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input-field" value={filters.category} onChange={(event) => update('category', event.target.value)}>
                <option value="">All categories</option>
                {meta.categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Min</label>
                <input className="input-field" type="number" value={filters.minPrice} onChange={(event) => setFilters({ ...filters, minPrice: event.target.value })} />
              </div>
              <div>
                <label className="label">Max</label>
                <input className="input-field" type="number" value={filters.maxPrice} onChange={(event) => setFilters({ ...filters, maxPrice: event.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Sort</label>
              <select className="input-field" value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value })}>
                <option value="newest">Newest</option>
                <option value="popular">Popular</option>
                <option value="rating">Top rated</option>
                <option value="priceAsc">Price: low to high</option>
                <option value="priceDesc">Price: high to low</option>
              </select>
            </div>
          </div>
        </aside>
        <section>
          {loading ? <ProductGridSkeleton /> : null}
          {!loading && products.length === 0 ? (
            <div className="card-surface text-center">
              <h2 className="text-2xl font-black">No products found</h2>
              <p className="mt-2 text-slate-500">Try a different search or remove a filter.</p>
            </div>
          ) : null}
          {!loading && products.length > 0 ? <div className="grid-responsive">{products.map((product) => <ProductCard key={product._id} product={product} />)}</div> : null}
        </section>
      </div>
    </main>
  );
};

export default Products;
