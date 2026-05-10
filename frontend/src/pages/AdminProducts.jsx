import { useContext, useEffect, useState } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const AdminProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', price: '', image: '', description: '', category: '', stock: '' });

  useEffect(() => {
    if (user?.role !== 'admin') return;
    const fetchProducts = async () => {
      const response = await API.get('/products');
      setProducts(response.data);
      setLoading(false);
    };
    fetchProducts();
  }, [user]);

  if (user?.role !== 'admin') {
    return <div className="text-center py-20">Access denied. Admin only.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await API.put(`/products/${editing}`, form);
      setProducts(products.map(p => p._id === editing ? { ...p, ...form } : p));
    } else {
      const response = await API.post('/products', form);
      setProducts([...products, response.data]);
    }
    setEditing(null);
    setForm({ title: '', price: '', image: '', description: '', category: '', stock: '' });
  };

  const handleDelete = async (id) => {
    await API.delete(`/products/${id}`);
    setProducts(products.filter(p => p._id !== id));
  };

  const startEdit = (product) => {
    setEditing(product._id);
    setForm({ title: product.title, price: product.price, image: product.image, description: product.description, category: product.category, stock: product.stock });
  };

  if (loading) return <div className="text-center py-20">Loading products...</div>;

  return (
    <main className="px-margin-page py-section-gap max-w-container-max mx-auto">
      <h1 className="font-display-xl text-h1 mb-12">Admin Product Management</h1>

      <div className="glass-card p-8 rounded-[40px] inner-glow mb-12">
        <h2 className="font-bold text-xl mb-6">{editing ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full rounded-3xl border border-outline-variant/30 bg-surface-container px-5 py-4 focus:outline-none" />
            <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" className="w-full rounded-3xl border border-outline-variant/30 bg-surface-container px-5 py-4 focus:outline-none" />
            <input required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL" className="w-full rounded-3xl border border-outline-variant/30 bg-surface-container px-5 py-4 focus:outline-none" />
            <input required type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Stock" className="w-full rounded-3xl border border-outline-variant/30 bg-surface-container px-5 py-4 focus:outline-none" />
            <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-3xl border border-outline-variant/30 bg-surface-container px-5 py-4 focus:outline-none">
              <option value="">Select Category</option>
              <option value="Apparel">Apparel</option>
              <option value="Accessories">Accessories</option>
              <option value="Tech">Tech</option>
              <option value="Living">Living</option>
              <option value="Timepieces">Timepieces</option>
              <option value="Beauty">Beauty</option>
            </select>
          </div>
          <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows="4" className="w-full rounded-3xl border border-outline-variant/30 bg-surface-container px-5 py-4 focus:outline-none"></textarea>
          <div className="flex gap-4">
            <button type="submit" className="bg-primary text-on-primary px-10 py-4 rounded-full font-bold primary-glow hover:scale-105 transition-all">
              {editing ? 'Update Product' : 'Add Product'}
            </button>
            {editing && <button type="button" onClick={() => { setEditing(null); setForm({ title: '', price: '', image: '', description: '', category: '', stock: '' }); }} className="border border-primary text-primary px-10 py-4 rounded-full font-bold hover:bg-primary/5 transition-all">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product._id} className="glass-card rounded-[40px] overflow-hidden inner-glow ambient-glow flex flex-col">
            <div className="h-64 overflow-hidden">
              <img className="w-full h-full object-cover" src={product.image} alt={product.title} />
            </div>
            <div className="p-8 flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-outline mb-2">
                <span>{product.category}</span>
                <span>{product.stock} in stock</span>
              </div>
              <h3 className="font-bold text-xl">{product.title}</h3>
              <p className="text-on-surface-variant line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="font-bold text-2xl">${product.price}</span>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(product)} className="w-10 h-10 border-2 border-primary text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="w-10 h-10 border-2 border-error text-error rounded-full flex items-center justify-center hover:bg-error hover:text-on-error transition-colors">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default AdminProducts;
