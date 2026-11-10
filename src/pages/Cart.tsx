import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, total, itemCount } = useCart();

  if (itemCount === 0) {
    return (
      <div className="py-32 text-center bg-black min-h-screen">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-gold">
          <ShoppingBag size={32} />
        </div>
        <h2 className="text-3xl font-display font-bold mb-4">Your bag is empty</h2>
        <p className="text-white/50 mb-10 max-w-sm mx-auto">Explore our premium collections and add something special to your bag.</p>
        <a href="/shop" className="inline-block bg-gold text-black px-10 py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-gold/90 transition-all">
          Start Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold mb-12">Shopping Bag</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* List */}
          <div className="lg:col-span-2 space-y-8">
            {cart.map(item => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-6 p-6 bg-[#0A0A0A] border border-gold/5"
              >
                <div className="w-24 h-24 flex-shrink-0 bg-white/5">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg mb-1">{item.name}</h3>
                  <p className="text-gold font-mono text-sm">₹{item.price.toLocaleString('en-IN')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-white/10 rounded-sm">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 text-white/50 hover:text-gold"><Minus size={14} /></button>
                    <span className="w-8 text-center text-sm font-mono">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-white/50 hover:text-gold"><Plus size={14} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-white/30 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="w-24 text-right">
                  <p className="font-mono text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-[#0A0A0A] border border-gold/10 p-8 h-fit sticky top-32">
            <h2 className="text-xl font-display font-bold mb-8 border-b border-gold/10 pb-4">Order Summary</h2>
            <div className="space-y-4 mb-8 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Subtotal ({itemCount} items)</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Shipping</span>
                <span className="text-emerald-500">{total > 2000 ? 'FREE' : '₹150'}</span>
              </div>
              <div className="border-t border-gold/10 pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-gold font-mono">₹{(total + (total > 2000 ? 0 : 150)).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <a href="/checkout" className="w-full bg-gold text-black py-4 rounded-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gold/90 transition-all">
              Checkout <ArrowRight size={18} />
            </a>
            <div className="mt-8 flex flex-col gap-4 text-[10px] uppercase tracking-widest text-white/30">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-gold rounded-full" />
                Secure Checkout Powered by Heavens
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-gold rounded-full" />
                Support for UPI, Cards & COD
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
