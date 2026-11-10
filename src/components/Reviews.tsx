import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Star, Send, Trash2, Loader2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

interface ReviewsProps {
  productId: string;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const Reviews: React.FC<ReviewsProps> = ({ productId }) => {
  const { user, login } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reviewsPath = `products/${productId}/reviews`;
    const q = query(collection(db, reviewsPath), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(fetchedReviews);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, reviewsPath);
    });

    return () => unsubscribe();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const reviewsPath = `products/${productId}/reviews`;

    try {
      await addDoc(collection(db, reviewsPath), {
        userId: user.uid,
        userName: user.displayName || 'Anonymous Connoisseur',
        rating,
        comment: comment.trim(),
        createdAt: serverTimestamp(),
      });
      setComment('');
      setRating(5);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, reviewsPath);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to remove this feedback?')) return;
    const reviewPath = `products/${productId}/reviews/${reviewId}`;
    try {
      await deleteDoc(doc(db, reviewPath));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, reviewPath);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="mt-32 border-t border-gold/10 pt-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div>
          <h2 className="text-4xl font-display font-bold text-gold-gradient uppercase tracking-tight mb-4">Customer Chronicles</h2>
          <p className="text-white/40 italic font-display text-lg">Echoes of indulgence from our celestial family.</p>
        </div>
        
        {averageRating && (
          <div className="flex items-center gap-6 bg-gold/5 border border-gold/10 p-8 rounded-sm shadow-xl">
            <div className="text-center">
              <span className="text-5xl font-display font-bold text-gold-gradient block mb-2">{averageRating}</span>
              <div className="flex gap-1 justify-center">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    size={14} 
                    className={star <= Math.round(Number(averageRating)) ? "text-gold" : "text-white/10"} 
                    fill={star <= Math.round(Number(averageRating)) ? "currentColor" : "none"}
                  />
                ))}
              </div>
            </div>
            <div className="h-12 w-px bg-gold/20" />
            <div className="text-left">
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 block mb-1 font-bold">Based on</span>
              <span className="text-lg font-bold text-white/80">{reviews.length} Reflections</span>
            </div>
          </div>
        )}
      </div>

      {/* Review Form */}
      <div className="mb-24">
        {!user ? (
          <div className="bg-[#050505] border border-dashed border-gold/20 p-12 text-center rounded-sm group hover:border-gold/40 transition-all">
            <MessageSquare size={32} className="text-gold/30 mx-auto mb-6 group-hover:scale-110 transition-transform" />
            <p className="text-white/50 mb-8 italic font-display text-lg">Share your own celestial experience.</p>
            <button 
              onClick={login}
              className="gold-shimmer text-black px-10 py-4 rounded-sm font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-gold/20"
            >
              Sign In to Review
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#0A0A0A] border border-gold/10 p-10 rounded-sm shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gold-gradient" />
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-6">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">Your Rating</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-125 relative z-10 p-1"
                    >
                      <Star 
                        size={24} 
                        className={star <= rating ? "text-gold" : "text-white/10"} 
                        fill={star <= rating ? "currentColor" : "none"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe your sensory journey through this masterpiece..."
                  className="w-full bg-black/50 border border-white/10 p-6 text-white placeholder:text-white/20 rounded-sm focus:border-gold outline-none transition-all min-h-[150px] font-display italic text-lg"
                  maxLength={1000}
                  required
                />
                <div className="absolute bottom-4 right-4 text-[10px] text-white/20 uppercase tracking-widest font-bold">
                  {comment.length} / 1000
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !comment.trim()}
                  className="gold-shimmer text-black px-12 py-5 rounded-sm font-bold uppercase tracking-[0.3em] text-xs flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-30 disabled:grayscale shadow-2xl shadow-gold/20"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                  Immortalize Reflection
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-gold" size={32} />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 border border-white/5 bg-white/5 rounded-sm italic font-display text-white/30 text-xl">
            Be the first to leave a celestial reflection.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10">
            <AnimatePresence mode="popLayout">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#050505] border border-white/5 p-10 rounded-sm group relative"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            size={12} 
                            className={star <= review.rating ? "text-gold" : "text-white/10"} 
                            fill={star <= review.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <h4 className="font-bold text-white/90 text-lg tracking-tight">{review.userName}</h4>
                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold block mt-1">
                        {review.createdAt?.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    
                    {(user?.uid === review.userId) && (
                      <button 
                        onClick={() => handleDelete(review.id)}
                        className="text-white/10 hover:text-red-500 transition-colors p-2"
                        title="Remove Review"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-white/60 font-display italic text-lg leading-relaxed border-l border-gold/10 pl-8 ml-1">
                    "{review.comment}"
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
