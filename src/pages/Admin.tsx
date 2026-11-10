import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Image as ImageIcon, 
  TrendingUp, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronRight,
  LogOut,
  Menu,
  X,
  Save,
  Loader2,
  RefreshCcw,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- API Helpers ---
const fetchAdmin = async (path: string, getToken: () => Promise<string | null>, options: any = {}) => {
  const token = await getToken();
  const res = await fetch(`/api/admin/${path}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const Admin: React.FC = () => {
  const { user, login, logout, getToken } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'products' | 'orders' | 'banners'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (user) {
        try {
          const s = await fetchAdmin('stats', getToken);
          setStats(s);
          setIsAdmin(true);
        } catch (e) {
          setIsAdmin(false);
        }
      }
    };
    checkAuth();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-[#0A0A0A] border border-gold/20 p-12 text-center shadow-2xl shadow-gold/5">
          <div className="w-20 h-20 bg-gold/5 border border-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 text-gold shadow-lg animate-glow">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-4xl font-display font-bold text-gold-gradient mb-4 uppercase tracking-tight">Admin Portal</h1>
          <p className="text-white/40 mb-10 text-[10px] font-bold uppercase tracking-[0.3em]">Heavens Wellness Internal System</p>
          <button onClick={login} className="w-full gold-shimmer text-black py-5 font-bold uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-gold/10">
            Secure Authentication
          </button>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin && user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
           <AlertCircle size={48} className="text-red-500 mx-auto mb-6" />
           <p className="text-gold-gradient uppercase tracking-[0.3em] font-bold text-lg">Unauthorized Access Attempt</p>
           <p className="text-white/30 text-[10px] mt-4 uppercase tracking-widest font-bold">This terminal is restricted to HW authorized personnel only.</p>
           <button onClick={() => window.location.href = '/'} className="mt-10 text-white/50 hover:text-gold transition-colors text-[10px] font-bold uppercase tracking-widest border-b border-white/10 pb-2">Return to Safety</button>
        </div>
      </div>
    );
  }


  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'banners', label: 'Banners', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "bg-[#050505] border-r border-gold/10 transition-all duration-300 flex flex-col z-50",
        isSidebarOpen ? "w-64" : "w-20",
        "fixed md:relative h-full",
        !isSidebarOpen && "md:w-20"
      )}>
        <div className="p-8 flex items-center justify-between border-b border-gold/10">
          {isSidebarOpen && <span className="font-display font-bold text-gold-gradient tracking-[0.2em] text-xl">HW ADMIN</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gold p-2 hover:bg-gold/5 transition-colors">
            {isSidebarOpen ? <X size={20} className="md:hidden" /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-6 space-y-4">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={cn(
                "w-full flex items-center gap-5 p-4 rounded-sm transition-all group",
                activeView === item.id 
                  ? "bg-gold-gradient text-black shadow-xl shadow-gold/20 scale-[1.02]" 
                  : "text-white/30 hover:text-gold hover:bg-gold/5"
              )}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gold/5">
          <button onClick={logout} className="w-full flex items-center gap-4 p-4 text-red-500/50 hover:text-red-500 transition-colors uppercase text-xs font-bold tracking-widest">
            <LogOut size={18} />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto">
        <header className="p-8 border-b border-gold/10 flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-xl z-40">
          <h2 className="text-3xl font-display font-bold text-gold-gradient tracking-tight">{activeView}</h2>
          <div className="flex items-center gap-8">
            <span className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold hidden sm:block">{user.email}</span>
            <div className="w-10 h-10 rounded-full border border-gold/20 p-0.5 overflow-hidden shadow-lg">
               <img src={user.photoURL || ''} alt="Profile" className="w-full h-full rounded-full object-cover" />
            </div>
          </div>
        </header>


        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeView === 'dashboard' && <Dashboard stats={stats} refresh={() => fetchAdmin('stats', getToken).then(setStats)} />}
            {activeView === 'products' && <ProductsManagement getToken={getToken} />}
            {activeView === 'orders' && <OrdersManagement getToken={getToken} />}
            {activeView === 'banners' && <div className="p-20 text-center text-white/20">Banner Management coming soon...</div>}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const Dashboard: React.FC<{ stats: any, refresh: () => void }> = ({ stats, refresh }) => {
  if (!stats) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-gold" /></div>;

  const cards = [
    { label: 'Total Revenue', value: `₹${stats.totalSales.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Active Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-gold' },
    { label: 'Our Products', value: stats.totalProducts, icon: Package, color: 'text-blue-500' },
    { label: 'Customers', value: stats.totalCustomers, icon: Users, color: 'text-purple-500' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      <div className="flex justify-between items-center">
        <h3 className="text-white/40 uppercase tracking-widest text-xs font-bold">Store Overview</h3>
        <button onClick={refresh} className="text-gold/50 hover:text-gold transition-colors"><RefreshCcw size={16} /></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(card => (
          <div key={card.label} className="bg-[#0A0A0A] border border-gold/10 p-8 rounded-sm group hover:border-gold/30 transition-all">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{card.label}</span>
              <card.icon size={18} className={card.color} />
            </div>
            <p className="text-4xl font-mono font-bold text-white tracking-tighter group-hover:text-gold transition-colors">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-gold/10 p-8 rounded-sm">
          <h4 className="font-display text-lg mb-8 border-b border-gold/5 pb-4">Sales Analytics</h4>
          <div className="h-64 flex items-center justify-center text-white/10 italic text-sm">Visual reports generated from PostgreSQL engine...</div>
        </div>
        <div className="bg-[#0A0A0A] border border-gold/10 p-8 rounded-sm">
          <h4 className="font-display text-lg mb-8 border-b border-gold/5 pb-4">Recent Activity</h4>
          <div className="space-y-6">
             {[1,2,3].map(i => (
               <div key={i} className="flex gap-4 items-center opacity-40">
                 <div className="w-2 h-2 rounded-full bg-gold" />
                 <div>
                   <p className="text-xs font-bold uppercase tracking-widest">New Order #892{i}</p>
                   <p className="text-[10px] text-white/50">2 mins ago</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProductsManagement: React.FC<{ getToken: any }> = ({ getToken }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<any>(null);

  const fetchProducts = async () => {
    try {
      const data = await fetchAdmin('products', getToken);
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this product from catalog?")) return;
    await fetchAdmin(`products/${id}`, getToken, { method: 'DELETE' });
    fetchProducts();
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-gold" /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-white/40 uppercase tracking-widest text-xs font-bold">Catalog Management</h3>
        <button onClick={() => setIsEditing({})} className="bg-gold text-black px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gold/90 transition-all">
          <Plus size={14} /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-[#0A0A0A] border border-gold/10 p-6 rounded-sm flex flex-col md:flex-row items-center gap-6 group hover:border-gold/30 transition-all">
            <img src={p.image} className="w-16 h-16 object-cover bg-white/5 border border-gold/10" />
            <div className="flex-1 text-center md:text-left">
              <h4 className="font-display font-bold text-lg mb-1">{p.name}</h4>
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">{p.category || 'Standard'}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <span className="text-gold font-mono">₹{p.price.toLocaleString()}</span>
                <span className={cn("text-xs uppercase font-bold tracking-widest", p.stock < 10 ? "text-red-500" : "text-emerald-500")}>
                  {p.stock} In Stock
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsEditing(p)} className="p-3 bg-white/5 border border-white/5 text-white/40 hover:text-gold hover:border-gold/30 transition-all">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-3 bg-white/5 border border-white/5 text-white/40 hover:text-red-500 hover:border-red-500/30 transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Product Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-6 overflow-y-auto">
           <div className="max-w-2xl w-full bg-[#0A0A0A] border border-gold/20 p-10 my-8">
             <div className="flex justify-between items-center mb-10">
               <h4 className="text-2xl font-display font-bold text-gold uppercase tracking-widest">{isEditing.id ? 'Edit Product' : 'Add New Masterpiece'}</h4>
               <button onClick={() => setIsEditing(null)} className="text-white/40 hover:text-white transition-colors"><X size={24} /></button>
             </div>
             <form className="space-y-6" onSubmit={async (e) => { 
               e.preventDefault();
               const formData = new FormData(e.currentTarget);
               const data = Object.fromEntries(formData.entries());
               const payload = {
                 ...data,
                 price: parseFloat(data.price as string),
                 stock: parseInt(data.stock as string),
                 active: true
               };
               
               try {
                 if (isEditing.id) {
                   await fetchAdmin(`products/${isEditing.id}`, getToken, { method: 'PATCH', body: JSON.stringify(payload) });
                 } else {
                   await fetchAdmin('products', getToken, { method: 'POST', body: JSON.stringify(payload) });
                 }
                 setIsEditing(null);
                 fetchProducts();
               } catch (err: any) {
                 alert(err.message);
               }
             }}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Product Name</label>
                   <input name="name" defaultValue={isEditing.name} placeholder="Midnight Truffles..." className="w-full bg-white/5 border border-white/10 p-4 rounded-sm text-sm focus:border-gold outline-none transition-all" required />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Price (INR)</label>
                   <input name="price" defaultValue={isEditing.price} placeholder="999" type="number" step="0.01" className="w-full bg-white/5 border border-white/10 p-4 rounded-sm text-sm focus:border-gold outline-none transition-all" required />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Image URL</label>
                 <input name="image" defaultValue={isEditing.image} placeholder="https://..." className="w-full bg-white/5 border border-white/10 p-4 rounded-sm text-sm focus:border-gold outline-none transition-all" required />
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Description</label>
                 <textarea name="description" defaultValue={isEditing.description} placeholder="Describe the essence..." className="w-full bg-white/5 border border-white/10 p-4 rounded-sm text-sm h-32 focus:border-gold outline-none transition-all" />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Inventory Units</label>
                   <input name="stock" defaultValue={isEditing.stock} placeholder="50" type="number" className="w-full bg-white/5 border border-white/10 p-4 rounded-sm text-sm focus:border-gold outline-none transition-all" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Collection Category</label>
                   <input name="category" defaultValue={isEditing.category} placeholder="Truffles" className="w-full bg-white/5 border border-white/10 p-4 rounded-sm text-sm focus:border-gold outline-none transition-all" />
                 </div>
               </div>
               <button type="submit" className="w-full gold-shimmer text-black py-5 font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-gold/20">
                 <Save size={18} /> Sync to Database
               </button>
             </form>
           </div>
        </div>
      )}
    </motion.div>
  );
};

const OrdersManagement: React.FC<{ getToken: any }> = ({ getToken }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await fetchAdmin('orders', getToken);
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetchAdmin(`orders/${id}/status`, getToken, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    fetchOrders();
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-gold" /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
       <div className="bg-[#0A0A0A] border border-gold/10 rounded-sm overflow-hidden">
         <table className="w-full text-left text-sm hidden lg:table">
           <thead className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-white/30">
             <tr>
               <th className="p-6">Order ID</th>
               <th className="p-6">Customer</th>
               <th className="p-6">Method</th>
               <th className="p-6">Total</th>
               <th className="p-6">Status</th>
               <th className="p-6">Payment</th>
               <th className="p-6 text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-white/5">
             {orders.map(o => (
               <tr key={o.id} className="hover:bg-white/5 transition-all group">
                 <td className="p-6 font-mono text-gold font-bold">#ORD-{o.id}</td>
                 <td className="p-6">
                   <p className="font-bold">{o.customer?.fullName}</p>
                   <p className="text-[10px] text-white/30">{o.customer?.email}</p>
                 </td>
                 <td className="p-6 text-[10px] font-bold uppercase tracking-widest text-white/50">{o.paymentMethod}</td>
                 <td className="p-6 font-mono">₹{o.totalAmount.toLocaleString()}</td>
                 <td className="p-6">
                   <select 
                    value={o.status} 
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className={cn(
                      "bg-black border border-gold/20 p-2 text-[10px] font-bold uppercase tracking-widest outline-none",
                      o.status === 'Delivered' ? "text-emerald-500" : "text-gold"
                    )}
                   >
                     {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                 </td>
                 <td className="p-6">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm",
                      o.payment?.status === 'Completed' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                    )}>
                      {o.paymentMethod === 'COD' && o.status !== 'Delivered' ? 'PENDING (COD)' : (o.payment?.status || 'NOT PAID')}
                    </span>
                 </td>
                 <td className="p-6 text-right">
                   <button className="text-white/20 group-hover:text-gold transition-colors"><ChevronRight size={18} /></button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>

         {/* Mobile View */}
         <div className="lg:hidden p-4 space-y-4">
           {orders.map(o => (
             <div key={o.id} className="bg-black border border-gold/10 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-gold font-bold">#ORD-{o.id}</span>
                  <span className="text-[10px] text-white/30">{o.paymentMethod}</span>
                </div>
                <div>
                   <p className="font-bold">{o.customer?.fullName}</p>
                   <p className="text-xs text-white/30">{o.customer?.email}</p>
                </div>
                <div className="flex justify-between items-center border-t border-gold/5 pt-4">
                   <p className="font-mono font-bold">₹{o.totalAmount.toLocaleString()}</p>
                   <select 
                    value={o.status} 
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="bg-black border border-gold/20 p-2 text-[10px] font-bold uppercase tracking-widest text-gold"
                   >
                     {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                </div>
                <div className="text-center pt-2">
                   <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      o.payment?.status === 'Completed' ? "text-emerald-500" : "text-red-500"
                    )}>
                      Payment: {o.paymentMethod === 'COD' && o.status !== 'Delivered' ? 'PENDING (COD)' : (o.payment?.status || 'NOT PAID')}
                    </span>
                </div>
             </div>
           ))}
         </div>
       </div>
    </motion.div>
  );
};

