import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Mail, Phone, MapPin, ChevronDown } from 'lucide-react';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="border-b border-gold/10 py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left hover:text-gold transition-colors"
      >
        <span className="font-display text-lg font-semibold">{question}</span>
        <ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={20} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 mt-4' : 'max-h-0'}`}>
        <p className="text-white/50 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

export const CustomerService: React.FC = () => {
  return (
    <div className="bg-black min-h-screen py-12 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">How can we help?</h1>
          <p className="text-white/50 max-w-xl mx-auto">Our concierge team is dedicated to providing you with the ultimate luxury service experience.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-24">
          <div className="text-center p-8 bg-[#0A0A0A] border border-gold/5">
            <MessageSquare className="text-gold mx-auto mb-6" size={32} />
            <h3 className="font-display text-xl mb-4">Live Concierge</h3>
            <p className="text-sm text-white/40 mb-6">Chat with our chocolate experts via WhatsApp for immediate assistance.</p>
            <a href="https://wa.me/918305103304" className="inline-block text-gold font-bold text-xs uppercase tracking-widest border-b border-gold/30 pb-1">Start Chat</a>
          </div>
          <div className="text-center p-8 bg-[#0A0A0A] border border-gold/5">
            <Mail className="text-gold mx-auto mb-6" size={32} />
            <h3 className="font-display text-xl mb-4">Email Inquiry</h3>
            <p className="text-sm text-white/40 mb-6">Send us an email and our team will get back to you within 24 hours.</p>
            <a href="mailto:concierge@heavenswellness.com" className="inline-block text-gold font-bold text-xs uppercase tracking-widest border-b border-gold/30 pb-1">concierge@heavenswellness.com</a>
          </div>
          <div className="text-center p-8 bg-[#0A0A0A] border border-gold/5">
            <Phone className="text-gold mx-auto mb-6" size={32} />
            <h3 className="font-display text-xl mb-4">Phone Support</h3>
            <p className="text-sm text-white/40 mb-6">Call our premium helpline for order tracking or special requests.</p>
            <a href="tel:+918305103304" className="inline-block text-gold font-bold text-xs uppercase tracking-widest border-b border-gold/30 pb-1">+91 83051 03304</a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <section id="faqs">
            <h2 className="text-3xl font-display font-bold mb-10">Frequently Asked Questions</h2>
            <div className="space-y-2">
              <FAQItem 
                question="How do you ensure chocolate doesn't melt during delivery?" 
                answer="We use specialized temperature-controlled insulated packaging with gel ice packs to ensure your chocolates arrive in perfect, celestial condition even in the Indian summer." 
              />
              <FAQItem 
                question="Is your gold leaf actually edible?" 
                answer="Yes, we use certified 24-karat edible gold leaf that meets all international food safety standards (E175). It has no taste and is purely for visual elegance." 
              />
              <FAQItem 
                question="Do you offer corporate gifting?" 
                answer="Absolutely. We specialize in bespoke corporate gifting solutions for luxury brands and premium clients. Please contact our concierge for a catalog." 
              />
              <FAQItem 
                question="What is the shelf life of Midnight Mood truffles?" 
                answer="Since we use fresh ingredients and no preservatives, our truffles are best enjoyed within 30 days of production when stored in a cool, dry place (16-18°C)." 
              />
            </div>
          </section>

          <section className="bg-[#0A0A0A] p-10 border border-gold/10">
            <h2 className="text-3xl font-display font-bold mb-8">Visit Our Studio</h2>
            <div className="space-y-6 text-white/60">
              <div className="flex gap-4">
                <MapPin className="text-gold flex-shrink-0" size={20} />
                <p>Midnight Manor, <br />Celestial Heights, Mumbai, <br />Maharashtra 400001, India</p>
              </div>
              <div className="flex gap-4">
                <Phone className="text-gold flex-shrink-0" size={20} />
                <p>Mon-Sat: 10:00 AM - 8:00 PM</p>
              </div>
            </div>
            <div className="mt-10 aspect-video bg-white/5 border border-white/10 flex items-center justify-center">
              <p className="text-white/20 text-xs uppercase tracking-widest">Map Placeholder</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
