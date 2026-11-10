import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

const WHATSAPP_NUMBER = "918305103304";

export const WhatsAppButton: React.FC = () => {
  const handleClick = () => {
    const message = encodeURIComponent("Hello Heavens Wellness, I'm interested in the Midnight Mood collection.");
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className="fixed bottom-8 left-8 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center group"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-3 transition-all duration-500 whitespace-nowrap text-sm font-bold uppercase tracking-widest">
        Support
      </span>
    </motion.button>
  );
};
