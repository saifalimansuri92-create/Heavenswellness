import React, { useState } from 'react';
import { TruffleScene } from '../components/TruffleScene';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, RotateCw, Sparkles, Box, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Experience: React.FC = () => {
  const [finish, setFinish] = useState<'dark' | 'milk' | 'gold'>('dark');
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isHudVisible, setIsHudVisible] = useState(true);

  const finishes = [
    { id: 'dark', label: 'Midnight Dark', color: 'bg-[#1a0d00]' },
    { id: 'milk', label: 'Celestial Milk', color: 'bg-[#4d2600]' },
    { id: 'gold', label: 'Solar Gold', color: 'bg-[#ffd700]' },
  ];

  return (
    <div className="relative w-screen h-screen bg-[#050505] overflow-hidden">
      {/* 3D Viewport */}
      <div className="absolute inset-0 z-0">
        <TruffleScene finish={finish} isAutoRotate={isAutoRotate} />
      </div>

      {/* Header Overlay */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-gold transition-colors text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
            <ArrowLeft size={16} /> Exit Experience
          </Link>
          <div className="bg-black/40 backdrop-blur-md border border-gold/10 p-6 rounded-sm">
            <span className="text-gold tracking-[0.4em] uppercase text-[10px] font-bold mb-2 block">Sensory Virtualization</span>
            <h1 className="text-3xl font-display font-bold text-gold-gradient uppercase tracking-tight">The Digital Masterpiece</h1>
          </div>
        </div>

        <div className="pointer-events-auto flex flex-col gap-4 items-end">
           <div className="bg-black/40 backdrop-blur-md border border-gold/10 p-4 rounded-sm flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Neural Engine Active</span>
           </div>
        </div>
      </div>

      {/* Bottom Control Dock */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[940px] px-4 z-20">
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={() => setIsHudVisible(!isHudVisible)}
            className="bg-black/60 border border-gold/20 text-gold px-6 py-2 rounded-t-sm flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gold/10 transition-all pointer-events-auto"
          >
            {isHudVisible ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            {isHudVisible ? 'Hide Controls' : 'Show Controls'}
          </button>

          <AnimatePresence>
            {isHudVisible && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="w-full bg-black/80 border border-gold/20 p-8 flex flex-col md:flex-row items-center justify-between gap-8 pointer-events-auto"
              >
                {/* Finishes */}
                <div className="flex flex-col gap-4 w-full md:w-auto">
                  <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold flex items-center gap-2">
                    <Sparkles size={12} className="text-gold" /> Material Essence
                  </span>
                  <div className="flex gap-4">
                    {finishes.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFinish(f.id as any)}
                        className={`flex flex-col items-center gap-3 p-4 border transition-all rounded-sm group ${
                          finish === f.id ? 'border-gold bg-gold/5' : 'border-white/10 hover:border-gold/30'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full shadow-lg ${f.color} ${finish === f.id ? 'ring-2 ring-gold ring-offset-2 ring-offset-black' : ''}`} />
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${finish === f.id ? 'text-gold' : 'text-white/40'}`}>
                          {f.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-16 w-px bg-gold/10 hidden md:block" />

                {/* View Controls */}
                <div className="flex flex-col gap-4 w-full md:w-auto">
                  <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold flex items-center gap-2">
                    <Box size={12} className="text-gold" /> Kinematics
                  </span>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setIsAutoRotate(!isAutoRotate)}
                      className={`flex-1 md:flex-none px-8 py-4 border rounded-sm flex items-center gap-3 transition-all ${
                        isAutoRotate ? 'border-gold text-gold bg-gold/5 shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'border-white/10 text-white/40 hover:border-gold/30'
                      }`}
                    >
                      <RotateCw size={14} className={isAutoRotate ? 'animate-spin-slow' : ''} />
                      <span className="text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">Auto-Orbit</span>
                    </button>
                  </div>
                </div>

                <div className="h-16 w-px bg-gold/10 hidden md:block" />

                {/* Action */}
                <div className="w-full md:w-auto">
                  <Link 
                    to="/shop"
                    className="gold-shimmer text-black px-12 py-5 rounded-sm font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-gold/20"
                  >
                    Acquire Physical Asset
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Aesthetic Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
    </div>
  );
};
