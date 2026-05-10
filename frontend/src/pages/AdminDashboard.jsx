import { useEffect, useState } from 'react';
import { BarChart3, Boxes, PackageCheck, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../services/api';

const emptyForm = { title: '', price: '', image: '', description: '', category: 'Tech', stock: '', isFeatured: false, isTrending: false };

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const [analyticsRes, productsRes, ordersRes, usersRes] = await Promise.all([
      API.get('/admin/analytics'),
      API.get('/products'),
      API.get('/orders/admin/all'),
      API.get('/admin/users'),
    ]);
    setAnalytics(analyticsRes.data);
    setProducts(productsRes.data);
    setOrders(ordersRes.data);
    setUsers(usersRes.data);
  };

  useEffect(() => { load(); }, []);

  const uploadImage = async (file) => {
    if (!file) return;
    const data = new FormData();
    data.append('image', file);
    try {
      const response = await API.post('/uploads/product-image', data);
      setForm((current) => ({ ...current, image: response.data.url }));
      toast.success('Image uploaded');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cloudinary upload failed');
    }
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    if (editing) {
      await API.put(`/products/${editing}`, payload);
      toast.success('Product updated');
    } else {
      await API.post('/products', payload);
      toast.success('Product created');
    }
    setForm(emptyForm);
    setEditing(null);
    await load();
  };

  const editProduct = (product) => {
    setEditing(product._id);
    setForm({ ...emptyForm, ...product });
  };

  const deleteProduct = async (id) => {
    await API.delete(`/products/${id}`);
    toast.success('Product deleted');
    await load();
  };

  return (
    <main className="page-shell section-space">
      <div className="mb-8">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Commerce dashboard</h1>
      </div>
      <div className="grid gap-5 md:grid-cols-4">
        {[[BarChart3, `$${(analytics?.revenue || 0).toFixed(0)}`, 'Revenue'], [Users, analytics?.users || 0, 'Users'], [Boxes, analytics?.products || 0, 'Products'], [PackageCheck, analytics?.orders || 0, 'Orders']].map(([Icon, value, label]) => (
          <div key={label} className="card-surface"><Icon className="text-indigo-600" /><p className="mt-4 text-3xl font-black">{value}</p><p className="text-sm font-bold text-slate-500">{label}</p></div>
        ))}
      </div>

      <section className="card-surface mt-8">
        <h2 className="text-2xl font-black">{editing ? 'Edit product' : 'Add product'}</h2>
        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={saveProduct}>
          <input className="input-field" required placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          <input className="input-field" required type="number" placeholder="Price" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
          <input className="input-field" required placeholder="Image URL" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} />
          <input className="input-field" type="file" accept="image/*" onChange={(event) => uploadImage(event.target.files?.[0])} />
          <select className="input-field" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
            {['Tech', 'Apparel', 'Accessories', 'Living', 'Timepieces', 'Beauty'].map((item) => <option key={item}>{item}</option>)}
          </select>
          <input className="input-field" required type="number" placeholder="Stock" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} />
          <textarea className="input-field min-h-28 md:col-span-2" required placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <label className="flex items-center gap-2 font-bold"><input type="checkbox" checked={form.isFeatured} onChange={(event) => setForm({ ...form, isFeatured: event.target.checked })} /> Featured</label>
          <label className="flex items-center gap-2 font-bold"><input type="checkbox" checked={form.isTrending} onChange={(event) => setForm({ ...form, isTrending: event.target.checked })} /> Trending</label>
          <button className="btn-primary md:col-span-2" type="submit">{editing ? 'Update product' : 'Create product'}</button>
        </form>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[1fr_24rem]">
        <div className="card-surface overflow-hidden">
          <h2 className="text-2xl font-black">Inventory</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-slate-500"><tr><th className="py-3">Product</th><th>Category</th><th>Stock</th><th>Price</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-t border-slate-100">
                    <td className="py-3 font-black">{product.title}</td>
                    <td>{product.category}</td>
                    <td>{product.stock}</td>
                    <td>${product.price}</td>
                    <td className="space-x-3"><button className="font-bold text-indigo-600" onClick={() => editProduct(product)}>Edit</button><button className="font-bold text-rose-600" onClick={() => deleteProduct(product._id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="space-y-8">
          <section className="card-surface">
            <h2 className="text-2xl font-black">Users</h2>
            <div className="mt-4 space-y-3">{users.slice(0, 6).map((user) => <div key={user._id} className="panel-soft"><p className="font-black">{user.name}</p><p className="text-sm text-slate-500">{user.email}</p></div>)}</div>
          </section>
          <section className="card-surface">
            <h2 className="text-2xl font-black">Orders</h2>
            <div className="mt-4 space-y-3">{orders.slice(0, 5).map((order) => <div key={order._id} className="panel-soft flex justify-between"><span className="font-black">#{order._id.slice(-6)}</span><span>${order.totalPrice.toFixed(0)}</span></div>)}</div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;
