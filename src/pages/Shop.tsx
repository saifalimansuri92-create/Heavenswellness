import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Filter, Heart, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  weight: string;
  stock: number;
}

export const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Expected array from /api/products, got:', data);
          setProducts([]);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))].filter(Boolean) as string[];
  const filteredProducts = filter === 'All' ? products : products.filter(p => p.category === filter);

  return (
    <div className="py-20 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-gold tracking-[0.4em] uppercase text-[10px] font-bold mb-3 block animate-glow">Midnight Mood</span>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 uppercase tracking-tight text-gold-gradient drop-shadow-2xl">The Collection</h1>
          <p className="text-white/50 max-w-xl mx-auto italic font-display text-lg">Discover the artistry of celestial indulgence in every handcrafted piece.</p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-6 mb-20">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-sm border ${
                filter === cat 
                  ? 'bg-gold-gradient text-black border-transparent shadow-xl shadow-gold/20 scale-105' 
                  : 'bg-white/5 text-white/50 border-white/10 hover:border-gold/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-96 gap-6">
            <div className="relative">
              <Loader2 className="animate-spin text-gold" size={48} />
              <div className="absolute inset-0 blur-xl bg-gold/20 animate-pulse" />
            </div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-gold/40 font-bold">Harvesting the finest cocoa...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32 bg-white/5 border border-white/5 rounded-sm">
            <p className="text-white/30 font-display italic text-xl">The vault is currently empty for this selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {filteredProducts.map(product => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                className="bg-[#0A0A0A] border border-gold/10 group relative shadow-2xl transition-all hover:border-gold/30"
              >
                <div className="relative aspect-square overflow-hidden">
                  <a href={`/product/${product.id}`} className="block w-full h-full">
                    <img 
                      src={product.image || ''} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-transparent transition-colors duration-500" />
                  </a>
                  <button 
                    onClick={() => toggleWishlist(product.id.toString())}
                    className="absolute top-6 right-6 z-10 p-4 bg-black/60 backdrop-blur-md rounded-full text-gold hover:bg-gold-gradient hover:text-black transition-all shadow-xl"
                  >
                    <Heart size={18} fill={isInWishlist(product.id.toString()) ? "currentColor" : "none"} />
                  </button>
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="bg-black/90 border border-gold/30 px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-gradient backdrop-blur-sm shadow-2xl">Sold Out</span>
                    </div>
                  )}
                </div>
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <span className="text-[10px] tracking-[0.2em] text-gold/40 uppercase block mb-2 font-bold">{product.category}</span>
                      <h3 className="font-display font-bold text-xl group-hover:text-gold-gradient transition-all tracking-tight leading-tight">
                        <a href={`/product/${product.id}`}>{product.name}</a>
                      </h3>
                    </div>
                    <p className="text-gold-gradient font-mono font-bold text-lg">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                  <p className="text-[11px] text-white/30 mb-10 uppercase tracking-widest font-medium italic">{product.weight}</p>
                  <button
                    onClick={() => addToCart({ ...product, id: product.id.toString(), quantity: 1 })}
                    disabled={product.stock <= 0}
                    className="w-full py-5 gold-shimmer text-black text-[11px] font-bold uppercase tracking-[0.2em] hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale shadow-xl shadow-gold/10"
                  >
                    <ShoppingCart size={16} />
                    Add to Bag
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

