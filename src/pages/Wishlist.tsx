import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  weight: string;
  stock: number;
}

export const Wishlist: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      // Firestore whereIn limit is 30, but we likely have fewer
      const q = query(collection(db, 'products'), where(documentId(), 'in', wishlist));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(items);
      setLoading(false);
    };

    fetchWishlistProducts();
  }, [wishlist]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold"></div>
    </div>
  );

  if (wishlist.length === 0) {
    return (
      <div className="py-32 text-center bg-black min-h-screen">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-gold">
          <Heart size={32} />
        </div>
        <h2 className="text-3xl font-display font-bold mb-4">Your wishlist is empty</h2>
        <p className="text-white/50 mb-10 max-w-sm mx-auto">Save your favorite Midnight Mood chocolates for later indulgence.</p>
        <a href="/shop" className="inline-block bg-gold text-black px-10 py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-gold/90 transition-all">
          Explore Collection
        </a>
      </div>
    );
  }

  return (
    <div className="py-12 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold mb-12">My Wishlist</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(product => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#0A0A0A] border border-gold/5 group relative"
            >
              <button 
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-md rounded-full text-gold hover:bg-gold hover:text-black transition-all"
              >
                <Trash2 size={16} />
              </button>

              <a href={`/product/${product.id}`} className="block aspect-square overflow-hidden relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
              </a>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] tracking-widest text-white/40 uppercase block mb-1">{product.category}</span>
                    <h3 className="font-display font-semibold group-hover:text-gold transition-colors">
                      <a href={`/product/${product.id}`}>{product.name}</a>
                    </h3>
                  </div>
                  <p className="text-gold font-mono">₹{product.price.toLocaleString('en-IN')}</p>
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => addToCart({ ...product, quantity: 1 })}
                    disabled={product.stock <= 0}
                    className="flex-1 py-3 bg-gold text-black text-[10px] font-bold uppercase tracking-widest hover:bg-gold/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ShoppingCart size={12} />
                    Add to Cart
                  </button>
                  <a 
                    href={`/product/${product.id}`}
                    className="p-3 border border-gold/30 text-gold hover:bg-gold/10 transition-all"
                  >
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
