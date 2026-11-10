import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, Moon, ShieldCheck, Truck, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const FeaturedSection: React.FC = () => {
  const [featured, setFeatured] = useState<any[]>([]);
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (Array.isArray(data)) {
          setFeatured(data.filter((p: any) => p.isBestSeller).slice(0, 3));
        } else {
          console.error('Expected array from /api/products, got:', data);
          setFeatured([]);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchFeatured();
  }, []);

  if (featured.length === 0) return null;

  return (
    <section className="py-24 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-gold tracking-[0.2em] uppercase text-[10px] font-bold mb-2 block">Curated Indulgences</span>
            <h2 className="text-4xl font-display font-bold uppercase tracking-tight text-gold-gradient">The Best Sellers</h2>
          </div>
          <a href="/shop" className="text-gold hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            Explore All <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featured.map(product => (
            <motion.div 
              key={product.id}
              whileHover={{ y: -10 }}
              className="group bg-black border border-gold/10 overflow-hidden relative"
            >
              <div className="aspect-square overflow-hidden relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <button 
                onClick={() => toggleWishlist(product.id.toString())}
                className="absolute top-4 right-4 z-10 p-3 bg-black/50 backdrop-blur-md rounded-full text-gold hover:bg-gold hover:text-black transition-all"
              >
                <Heart size={16} fill={isInWishlist(product.id.toString()) ? "currentColor" : "none"} />
              </button>
              <div className="p-8 text-center">
                <span className="text-[9px] tracking-[0.3em] uppercase text-white/40 mb-3 block font-bold">{product.category}</span>
                <h3 className="text-xl font-display font-bold mb-3 group-hover:text-gold-gradient transition-colors">{product.name}</h3>
                <p className="text-gold-gradient font-mono font-bold mb-6">₹{product.price.toLocaleString('en-IN')}</p>
                <a href={`/product/${product.id}`} className="text-[10px] font-bold tracking-[0.3em] uppercase border-b border-gold/20 pb-2 hover:border-gold transition-all text-white/70 hover:text-white">
                  View Masterpiece
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: "/public/assets/aistudio/Midnight_Mood_Chocolate_Romance_d2e10643.png",
      title: "MIDNIGHT MOOD",
      subtitle: "Heavens Wellness Presents",
      description: "Experience the rich taste and deeper feelings of our signature collection.",
      cta: "Shop Now"
    },
    {
      image: "/src/assets/images/hero_luxury_chocolate_gold_1794261652507.jpg",
      title: "CELESTIAL LUXURY",
      subtitle: "Pure Indulgence",
      description: "Crafted for those who appreciate the finer moments of life.",
      cta: "Explore Vault"
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[95vh] w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img 
            src={slides[currentSlide].image} 
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover lg:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent lg:bg-gradient-to-r lg:from-black/80 lg:via-black/20 lg:to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-3xl">
          <motion.div
            key={`content-${currentSlide}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <span className="text-gold tracking-[0.5em] uppercase text-[10px] md:text-xs font-bold mb-6 block animate-glow drop-shadow-lg">
              {slides[currentSlide].subtitle}
            </span>
            <h1 className="font-display font-bold text-white mb-8 leading-tight">
              {currentSlide === 0 ? (
                <div className="flex flex-col">
                  <span className="text-6xl md:text-8xl lg:text-[9rem] tracking-tighter">MIDNIGHT</span>
                  <span className="text-7xl md:text-[10rem] lg:text-[12rem] text-gold-gradient italic tracking-tighter ml-4 drop-shadow-2xl">MOOD</span>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className="text-6xl md:text-8xl lg:text-[8rem] tracking-tighter">CELESTIAL</span>
                  <span className="text-7xl md:text-[9rem] lg:text-[11rem] text-gold-gradient italic tracking-tighter ml-4 drop-shadow-2xl">LUXURY</span>
                </div>
              )}
            </h1>
            <p className="text-lg md:text-2xl text-white/90 mb-12 max-w-lg leading-relaxed font-display italic drop-shadow-md">
              {slides[currentSlide].description}
            </p>
            <div className="flex flex-wrap gap-6">
              <a href="/shop" className="gold-shimmer text-black px-12 py-5 rounded-sm font-bold uppercase tracking-[0.3em] text-xs md:text-sm flex items-center gap-3 hover:scale-105 transition-all group shadow-2xl shadow-gold/40 border border-gold/20">
                {slides[currentSlide].cta} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-12 left-4 sm:left-8 lg:left-12 flex items-center gap-6 z-20">
        <button 
          onClick={prevSlide}
          className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 transition-all backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1 transition-all duration-500 rounded-full ${currentSlide === i ? 'w-12 bg-gold' : 'w-4 bg-white/20'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button 
          onClick={nextSlide}
          className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 transition-all backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="absolute bottom-12 right-12 hidden lg:block">
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="flex flex-col items-center gap-4 text-white/30">
          <span className="text-[10px] tracking-[0.4em] uppercase vertical-text">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-gold/50 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export const Home: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <HeroSection />

      {/* Features */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gold/5 border border-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 text-gold group-hover:scale-110 group-hover:bg-gold/10 transition-all">
                <Moon size={28} />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-gold-gradient">Artisanal Craft</h3>
              <p className="text-white/50 text-sm leading-relaxed">Handcrafted in small batches using traditional techniques and modern innovation.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gold/5 border border-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 text-gold group-hover:scale-110 group-hover:bg-gold/10 transition-all">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-gold-gradient">Premium Ingredients</h3>
              <p className="text-white/50 text-sm leading-relaxed">Sourced from the finest cocoa estates in India, blended with edible 24k gold leaf.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gold/5 border border-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 text-gold group-hover:scale-110 group-hover:bg-gold/10 transition-all">
                <Truck size={28} />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-gold-gradient">Pan-India Delivery</h3>
              <p className="text-white/50 text-sm leading-relaxed">Safe, temperature-controlled shipping to your doorstep anywhere in India.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Valentine's Campaign */}
      <section className="py-24 bg-black border-t border-gold/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative aspect-video lg:aspect-square overflow-hidden border border-gold/10"
            >
              <img 
                src="/public/assets/aistudio/Midnight_Mood_Luxury_Chocolate_Gift_Set_15a5b98e.png" 
                alt="Luxury Gift Set" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6 bg-gold-gradient text-black px-4 py-2 text-xs font-bold uppercase tracking-widest shadow-lg">
                Limited Edition
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <span className="text-gold tracking-[0.3em] uppercase text-xs font-semibold mb-4 block">Seasonal Special</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-gold-gradient">Midnight Mood <br />Valentine's Gift Set</h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                Our most requested selection. A curated box of our signature chocolates designed to convey what words cannot. Experience the rich taste and deeper feelings.
              </p>
              <div className="flex items-center gap-6 mb-10">
                <span className="text-3xl font-mono text-gold-gradient font-bold">₹499</span>
                <span className="text-white/30 text-sm italic">Introductory Offer</span>
              </div>
              <button 
                onClick={() => window.location.href = '/shop'}
                className="gold-shimmer text-black px-10 py-5 rounded-sm font-bold uppercase tracking-widest hover:scale-105 transition-all inline-block shadow-xl shadow-gold/20"
              >
                Discover Collection
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <FeaturedSection />

      {/* Testimonials */}
      <section className="py-24 bg-black border-y border-gold/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Star className="text-gold mx-auto mb-8 animate-glow" fill="currentColor" size={32} />
          <h2 className="text-3xl font-display italic mb-10 leading-relaxed text-white/90">
            "The Midnight Mood truffles are quite simply the most exquisite chocolate I have ever tasted in India. The craftsmanship and the gold detailing make it a truly celestial experience."
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-gold/30" />
            <p className="text-sm tracking-widest uppercase text-gold-gradient font-bold">A. D. · Connoisseur</p>
            <div className="w-12 h-px bg-gold/30" />
          </div>
        </div>
      </section>

      {/* Brand Identity */}
      <section className="py-24 bg-[#050505] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <img 
              src="/public/assets/aistudio/73eef891-7903-4071-95e0-b6fa58ec8790_532ab210.png" 
              alt="HEAVENS WELLNESS Identity" 
              className="w-full h-auto max-w-4xl mx-auto border border-gold/10"
            />
            <div className="text-center mt-12">
              <h2 className="text-2xl font-display font-bold text-gold-gradient tracking-widest uppercase animate-glow">Pure Indulgence. Celestial Taste.</h2>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};


