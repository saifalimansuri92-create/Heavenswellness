import React from 'react';
import { motion } from 'motion/react';
import { Star, Shield, Award, Heart } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="bg-black">
      {/* Hero */}
      <section className="relative h-[65vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/src/assets/images/about_craftsmanship_1794259595713.jpg" 
            alt="Craftsmanship" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-gold tracking-[0.5em] uppercase text-xs font-bold mb-6 block animate-glow">The Heritage</span>
            <h1 className="text-6xl md:text-8xl font-display font-bold mb-8 text-gold-gradient drop-shadow-2xl">Our Alchemy</h1>
            <p className="text-white/70 max-w-2xl mx-auto text-xl leading-relaxed italic font-display">
              Founded on the principles of luxury, purity, and celestial harmony, Heavens Wellness is India's premier artisanal chocolate house.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-32 border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-5xl font-display font-bold mb-10 leading-tight">The <span className="text-gold-gradient italic">Midnight Mood</span> Philosophy</h2>
              <div className="space-y-8 text-white/60 text-lg leading-relaxed italic font-display">
                <p>
                  We believe that chocolate is not just a confection; it is a ritual. A moment of pause in the chaos of life, a celestial journey for the senses. Every piece of Heavens Wellness chocolate is crafted to evoke the serenity and mystery of the midnight hour.
                </p>
                <p>
                  Our master chocolatiers source the finest single-origin cocoa from the lush estates of Southern India, blending traditional European techniques with Indian soul.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-12">
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center text-gold flex-shrink-0">
                    <Star size={24} className="animate-glow" />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-widest text-xs mb-2 text-white/80">Pure Gold</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed">Infused with 24k edible gold leaf for a truly royal experience.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center text-gold flex-shrink-0">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-widest text-xs mb-2 text-white/80">Ethical Sourcing</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed">Direct-to-farmer relationships ensuring sustainability and quality.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="relative overflow-hidden border border-gold/10 shadow-2xl">
                <img src="/src/assets/images/product_midnight_truffles_1794259595011.jpg" className="w-full h-[500px] object-cover transition-transform duration-1000 hover:scale-110" />
                <div className="absolute inset-0 bg-black/20" />
              </div>
              <div className="relative overflow-hidden border border-gold/10 shadow-2xl mt-20">
                <img src="/public/assets/aistudio/73eef891-7903-4071-95e0-b6fa58ec8790_532ab210.png" className="w-full h-[500px] object-cover transition-transform duration-1000 hover:scale-110" />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <span className="text-gold tracking-[0.4em] uppercase text-[10px] font-bold mb-4 block">Our Values</span>
            <h2 className="text-4xl font-display font-bold mb-6 text-gold-gradient">The Pillars of Indulgence</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Award, title: "Uncompromising Quality", desc: "Only the top 1% of cocoa beans make it into our Masterpieces." },
              { icon: Heart, title: "Holistic Wellness", desc: "No artificial preservatives or palm oils. Pure cocoa butter only." },
              { icon: Star, title: "Celestial Elegance", desc: "Every box is a work of art, designed for the most discerning tastes." }
            ].map((value, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-12 border border-gold/5 bg-black hover:border-gold/30 transition-all group shadow-2xl"
              >
                <div className="w-20 h-20 bg-gold/5 border border-gold/10 rounded-full flex items-center justify-center mx-auto mb-10 text-gold group-hover:scale-110 group-hover:bg-gold/10 transition-all shadow-lg">
                  <value.icon size={36} />
                </div>
                <h3 className="text-xl font-display font-bold mb-6 tracking-wide group-hover:text-gold-gradient transition-all">{value.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed italic font-display">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

