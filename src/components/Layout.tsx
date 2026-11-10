import React, { useState } from 'react';
import { ShoppingBag, User, Menu, X, Instagram, Facebook, Phone, MessageCircle, Heart, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Chatbot } from './Chatbot';
import { WhatsAppButton } from './WhatsAppButton';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar: React.FC = () => {
  const { user, login, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Experience', href: '/experience' },
    { name: 'About', href: '/about' },
    { name: 'Service', href: '/service' },
    ...(isAdmin ? [{ name: 'Admin', href: '/admin' }] : []),
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-8">
          {/* Brand */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center gap-2 group">
              <img src="/public/assets/aistudio/73eef891-7903-4071-95e0-b6fa58ec8790_532ab210.png" alt="HEAVENS WELLNESS" className="h-14 w-auto object-contain transition-transform group-hover:scale-105" />
            </a>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10 flex-1 justify-center">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 hover:text-gold-gradient transition-all whitespace-nowrap"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 shrink-0">
            <a href="/wishlist" className="relative text-white/70 hover:text-gold transition-colors p-2">
              <Heart size={20} />
            </a>
            <a href="/cart" className="relative text-white/70 hover:text-gold transition-colors p-2">
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 gold-shimmer text-black text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-lg">
                  {itemCount}
                </span>
              )}
            </a>
            {user ? (
              <div className="flex items-center gap-4">
                <button onClick={logout} className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                  Sign Out
                </button>
                <div className="w-9 h-9 rounded-full border border-gold/30 p-0.5 flex items-center justify-center overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User size={18} className="text-gold" />
                  )}
                </div>
              </div>
            ) : (
              <button onClick={login} className="text-[10px] font-bold uppercase tracking-[0.2em] gold-shimmer text-black px-6 py-2.5 rounded-sm hover:scale-105 transition-all shadow-lg shadow-gold/20">
                Login
              </button>
            )}
            <button className="md:hidden text-white/70 p-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-black border-b border-gold/10 pb-8 px-6 pt-4"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-bold uppercase tracking-[0.3em] text-white/70 hover:text-gold transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050505] border-t border-gold/10 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-display tracking-[0.3em] text-gold-gradient font-bold mb-8 uppercase">
              HEAVENS WELLNESS
            </h2>
            <p className="text-white/40 max-w-sm mb-10 leading-relaxed italic font-display text-lg">
              Crafting premium chocolate experiences that transport you to a world of luxury and refined taste. Experience the Midnight Mood.
            </p>
            <div className="flex gap-6">
              <a href="#" className="w-12 h-12 rounded-full border border-gold/10 flex items-center justify-center text-gold hover:bg-gold-gradient hover:text-black transition-all shadow-lg">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full border border-gold/10 flex items-center justify-center text-gold hover:bg-gold-gradient hover:text-black transition-all shadow-lg">
                <Facebook size={20} />
              </a>
              <a href="https://wa.me/918305103304" className="w-12 h-12 rounded-full border border-gold/10 flex items-center justify-center text-gold hover:bg-gold-gradient hover:text-black transition-all shadow-lg">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-gold-gradient font-bold uppercase tracking-widest text-xs mb-8">Quick Links</h3>
            <ul className="space-y-4 text-white/40 text-sm font-medium">
              <li><a href="/shop" className="hover:text-gold transition-colors uppercase tracking-widest text-[10px]">Shop All</a></li>
              <li><a href="/about" className="hover:text-gold transition-colors uppercase tracking-widest text-[10px]">Our Story</a></li>
              <li><a href="/service" className="hover:text-gold transition-colors uppercase tracking-widest text-[10px]">Contact Us</a></li>
              <li><a href="/service#faqs" className="hover:text-gold transition-colors uppercase tracking-widest text-[10px]">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gold-gradient font-bold uppercase tracking-widest text-xs mb-8">Legal</h3>
            <ul className="space-y-4 text-white/40 text-sm font-medium">
              <li><a href="/service#privacy" className="hover:text-gold transition-colors uppercase tracking-widest text-[10px]">Privacy Policy</a></li>
              <li><a href="/service#terms" className="hover:text-gold transition-colors uppercase tracking-widest text-[10px]">Terms of Service</a></li>
              <li><a href="/service#refund" className="hover:text-gold transition-colors uppercase tracking-widest text-[10px]">Refund Policy</a></li>
              <li><a href="/service#shipping" className="hover:text-gold transition-colors uppercase tracking-widest text-[10px]">Shipping Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gold/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-white/30 text-[10px] uppercase tracking-[0.2em] font-bold">
          <p>© 2026 HEAVENS WELLNESS. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="flex items-center gap-2"><Moon size={12} className="text-gold" /> Made in India</span>
            <span className="text-gold">Premium Midnight Mood</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gold selection:text-black">
      <Navbar />
      <main className="pt-20">
        {children}
      </main>
      <Chatbot />
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

