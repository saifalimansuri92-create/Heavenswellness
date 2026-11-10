import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Shield, Truck, AlertCircle, Info, ChevronRight, Heart, Loader2, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Reviews } from '../components/Reviews';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  weight: string;
  stock: number;
  ingredients: string;
  allergens: string;
  nutrition: string;
}

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-black gap-6">
      <div className="relative">
        <Loader2 className="animate-spin text-gold" size={56} />
        <div className="absolute inset-0 blur-2xl bg-gold/30 animate-pulse" />
      </div>
      <span className="text-[11px] uppercase tracking-[0.4em] text-gold/40 font-bold">Unveiling the "Midnight Mood"...</span>
    </div>
  );

  if (!product) return (
    <div className="py-32 text-center bg-black min-h-screen">
      <h2 className="text-4xl font-display font-bold text-gold-gradient mb-8 uppercase tracking-widest">Product Not Found</h2>
      <Link to="/shop" className="text-white/50 hover:text-gold transition-colors flex items-center justify-center gap-2 uppercase text-[10px] font-bold tracking-[0.3em]">
        <ArrowLeft size={16} /> Return to Shop
      </Link>
    </div>
  );

  return (
    <div className="bg-black py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          {/* Gallery */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-32"
          >
            <div className="aspect-square overflow-hidden bg-[#0A0A0A] border border-gold/10 relative group shadow-2xl">
              <img src={product.image || ''} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <div className="mt-8 grid grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square bg-[#050505] border border-gold/5 flex items-center justify-center group hover:border-gold/30 transition-all cursor-pointer shadow-lg overflow-hidden">
                   <div className="absolute inset-0 bg-gold/5 group-hover:bg-gold/10 transition-colors" />
                   <span className="relative z-10 text-[9px] uppercase tracking-[0.3em] text-white/20 group-hover:text-gold/50 transition-colors font-bold">View Perspective {i}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div>
              <div className="flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase text-gold/60 font-bold mb-8">
                <Link to="/shop" className="hover:text-gold transition-colors">The Vault</Link>
                <ChevronRight size={10} className="text-white/20" />
                <span className="text-white/40">{product.category}</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 tracking-tight text-gold-gradient drop-shadow-2xl">{product.name}</h1>
              <p className="text-4xl text-gold-gradient font-mono font-bold mb-10">₹{product.price.toLocaleString('en-IN')}</p>
              
              <p className="text-white/70 leading-relaxed text-xl font-display italic max-w-xl">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-8 bg-[#0A0A0A] border border-gold/10 rounded-sm shadow-xl">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 block mb-3 font-bold">Net Weight</span>
                <span className="text-lg font-bold tracking-widest text-white/80">{product.weight}</span>
              </div>
              <div className="p-8 bg-[#0A0A0A] border border-gold/10 rounded-sm shadow-xl">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 block mb-3 font-bold">Inventory State</span>
                <span className={cn("text-lg font-bold uppercase tracking-widest", product.stock > 0 ? "text-emerald-500" : "text-red-500")}>
                  {product.stock > 0 ? `${product.stock} Units` : 'Sold Out'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center border border-gold/20 rounded-sm bg-white/5 backdrop-blur-sm">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-10 py-6 text-gold hover:bg-gold/10 transition-colors text-2xl font-bold"
                >
                  -
                </button>
                <span className="w-16 text-center font-mono font-bold text-xl">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-10 py-6 text-gold hover:bg-gold/10 transition-colors text-2xl font-bold"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => addToCart({ ...product, id: product.id.toString(), quantity })}
                disabled={product.stock <= 0}
                className="flex-1 gold-shimmer text-black py-6 rounded-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:scale-105 transition-all disabled:opacity-30 disabled:grayscale shadow-2xl shadow-gold/20"
              >
                <ShoppingCart size={22} />
                Secure Indulgence
              </button>
              <button
                onClick={() => toggleWishlist(product.id.toString())}
                className="p-6 border border-gold/20 text-gold hover:bg-gold-gradient hover:text-black transition-all rounded-sm group shadow-xl"
                title="Save for Later"
              >
                <Heart size={28} fill={isInWishlist(product.id.toString()) ? "currentColor" : "none"} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-16 border-t border-gold/10 pt-20">
              <section>
                <h3 className="flex items-center gap-3 font-display text-2xl mb-8 text-gold-gradient uppercase tracking-widest font-bold">
                  <Info size={24} className="text-gold" /> Composition & Essence
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-white/50 leading-relaxed">
                  <div className="bg-[#050505] p-10 border border-white/5 shadow-inner">
                    <h4 className="text-white/80 uppercase tracking-[0.3em] font-bold mb-6 text-[10px] border-b border-white/5 pb-4">Ingredients</h4>
                    <p className="italic font-display text-lg leading-relaxed">{product.ingredients || 'Hand-selected single-origin cocoa, precision cocoa butter, artisanal cane sugar, and natural infusions.'}</p>
                  </div>
                  <div className="bg-[#050505] p-10 border border-white/5 shadow-inner">
                    <h4 className="text-white/80 uppercase tracking-[0.3em] font-bold mb-6 text-[10px] border-b border-white/5 pb-4">Nutritional Profile</h4>
                    <p className="font-mono text-xs leading-loose">{product.nutrition || 'Serving: 25g | Energy: 140 kcal | Cocoa: 75% min.'}</p>
                  </div>
                </div>
              </section>

              <section className="bg-gold/5 p-10 border border-gold/10 rounded-sm">
                <h3 className="flex items-center gap-3 font-display text-xl mb-6 text-gold-gradient uppercase tracking-widest font-bold">
                  <AlertCircle size={22} className="text-gold" /> Allergen Awareness
                </h3>
                <p className="text-lg text-white/70 italic font-display leading-relaxed">{product.allergens || 'May contain whispers of dairy, soy lecithin, and noble tree nuts.'}</p>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="flex items-center gap-5 text-[11px] uppercase tracking-[0.3em] text-white/40 font-bold border border-white/10 p-6 shadow-xl">
                  <Truck size={24} className="text-gold" />
                  Temperature-Controlled Logistics
                </div>
                <div className="flex items-center gap-5 text-[11px] uppercase tracking-[0.3em] text-white/40 font-bold border border-white/10 p-6 shadow-xl">
                  <Shield size={24} className="text-gold" />
                  Sealed with HW Authenticity
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <Reviews productId={product.id.toString()} />
      </div>
    </div>
  );
};

