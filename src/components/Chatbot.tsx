import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Sparkles, ExternalLink, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
  sources?: { uri: string; title: string }[];
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      parts: [{ text: "Welcome to HEAVENS WELLNESS. I am your Celestial Sommelier. How may I assist your journey through the Midnight Mood collection today?" }],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', parts: [{ text: input }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error('Failed to reach the Celestial Sommelier');

      const data = await response.json();
      const modelMessage: Message = {
        role: 'model',
        parts: [{ text: data.text }],
        sources: data.sources,
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'model', parts: [{ text: "I apologize, the celestial connection is momentarily faint. Please try again shortly." }] },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[550px] bg-black border border-gold/20 rounded-lg shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-gold/10 bg-gradient-to-r from-black to-gold/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-display font-bold text-gold">Celestial Sommelier</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Heavens Wellness</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gold/20">
              {messages.map((msg, idx) => (
                <div key={idx} className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] p-4 rounded-sm text-sm leading-relaxed",
                      msg.role === 'user'
                        ? "bg-gold text-black font-medium"
                        : "bg-white/5 border border-gold/5 text-white/80"
                    )}
                  >
                    {msg.parts[0].text}
                  </div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.sources.map((source, sIdx) => (
                        <a
                          key={sIdx}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded hover:bg-white/10 flex items-center gap-1 text-white/50"
                        >
                          <ExternalLink size={8} /> {source.title || 'Source'}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start">
                  <div className="bg-white/5 border border-gold/5 p-4 rounded-sm flex items-center gap-2">
                    <Loader2 size={16} className="text-gold animate-spin" />
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">Consulting the Stars...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gold/10 bg-black">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about our collection..."
                  className="w-full bg-white/5 border border-white/10 p-3 pr-12 rounded-sm text-sm text-white focus:border-gold outline-none transition-colors placeholder:text-white/20"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 text-gold hover:text-white disabled:opacity-30 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gold text-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95 group relative"
      >
        <MessageCircle size={28} />
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white/30 border border-gold"></span>
          </span>
        )}
      </button>
    </div>
  );
};
