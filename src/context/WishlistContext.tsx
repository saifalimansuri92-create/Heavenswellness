import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query } from 'firebase/firestore';

interface WishlistItem {
  productId: string;
  addedAt: string;
}

interface WishlistContextType {
  wishlist: string[]; // List of product IDs
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }

    const q = query(collection(db, 'users', user.uid, 'wishlist'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ids = snapshot.docs.map(doc => doc.id);
      setWishlist(ids);
    });

    return unsubscribe;
  }, [user]);

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      alert("Please login to save favorites.");
      return;
    }

    const docRef = doc(db, 'users', user.uid, 'wishlist', productId);
    
    if (wishlist.includes(productId)) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, {
        productId,
        addedAt: new Date().toISOString()
      });
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
