import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { CheckCircle, Truck, CreditCard, ChevronLeft, Loader2, ShieldCheck, Smartphone, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type FormData = {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'UPI' | 'COD' | 'Online';
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const Checkout: React.FC = () => {
  const { cart, total, clearCart } = useCart();
  const { user, login, getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  const [orderResult, setOrderResult] = useState<any>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const navigate = useNavigate();

  const handleRazorpay = async (orderData: any, token: string, userDetails: any) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      amount: orderData.razorpayOrder.amount,
      currency: "INR",
      name: "HEAVENS WELLNESS",
      description: "Midnight Mood Premium Collection",
      order_id: orderData.razorpayOrder.id,
      handler: async (response: any) => {
        setIsSubmitting(true);
        setPaymentStatus('pending');
        try {
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              ...response,
              orderId: orderData.orderId
            })
          });

          if (!verifyRes.ok) throw new Error("Payment verification failed");
          
          setPaymentStatus('success');
          setOrderResult({ orderId: orderData.orderId });
          clearCart();
        } catch (error: any) {
          setPaymentStatus('failed');
          alert(error.message);
        } finally {
          setIsSubmitting(false);
        }
      },
      "modal": {
        "ondismiss": function() {
          setIsSubmitting(false);
          setPaymentStatus('idle');
        }
      },
      prefill: {
        name: userDetails.fullName,
        email: user?.email || '',
        contact: userDetails.phone
      },
      theme: {
        color: "#D4AF37"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };


  const onSubmit = async (data: FormData) => {
    if (!user) {
      alert("Please login to complete your order.");
      login();
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = await getToken();
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart,
          shippingAddress: data,
          paymentMethod: data.paymentMethod
        })
      });

      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();
      
      if (data.paymentMethod === 'COD') {
        setOrderResult(result);
        clearCart();
      } else {
        await handleRazorpay(result, token || '', data);
      }

    } catch (error: any) {
      console.error("Order failed:", error);
      alert(error.message || "Failed to process order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (paymentStatus === 'pending') {
    return (
      <div className="py-32 text-center bg-black min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <Loader2 className="animate-spin text-gold mx-auto" size={64} />
          <h2 className="text-3xl font-display font-bold text-gold-gradient uppercase tracking-widest">Verifying Transaction</h2>
          <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Please do not refresh or close this window.</p>
        </motion.div>
      </div>
    );
  }

  if (orderResult) {

    return (
      <div className="py-32 text-center bg-black min-h-screen">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md mx-auto p-12 bg-[#0A0A0A] border border-gold/20 shadow-2xl shadow-gold/5"
        >
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-10 text-emerald-500">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-4xl font-display font-bold mb-6 text-gold-gradient">Order Confirmed</h2>
          <p className="text-white/50 mb-6 leading-relaxed italic font-display">
            Your "Midnight Mood" is being prepared. An email confirmation has been sent to your registered address.
          </p>
          <div className="bg-white/5 p-4 rounded-sm mb-10 border border-white/5">
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Confirmation Reference</p>
            <p className="text-gold-gradient font-mono font-bold">#ORD-{orderResult.orderId}</p>
          </div>
          <button 
            onClick={() => navigate('/shop')}
            className="gold-shimmer text-black px-10 py-5 rounded-sm font-bold uppercase tracking-[0.2em] hover:scale-105 transition-all w-full"
          >
            Continue Indulgence
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/cart')} className="flex items-center gap-3 text-white/40 hover:text-gold transition-colors mb-12 text-[10px] uppercase tracking-[0.3em] font-bold">
          <ChevronLeft size={16} /> Back to Bag
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="mb-12">
              <span className="text-gold tracking-[0.3em] uppercase text-[10px] font-bold mb-2 block animate-glow">Secure Checkout</span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gold-gradient">Delivery Essence</h1>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold">Recipient Name</label>
                  <input {...register("fullName", { required: true })} className="w-full bg-white/5 border border-white/10 p-5 rounded-sm focus:border-gold outline-none transition-all placeholder:text-white/10" placeholder="e.g. Connoisseur Name" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold">Contact Number</label>
                  <input {...register("phone", { required: true })} className="w-full bg-white/5 border border-white/10 p-5 rounded-sm focus:border-gold outline-none transition-all placeholder:text-white/10" placeholder="+91" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold">Street Address</label>
                <input {...register("street", { required: true })} className="w-full bg-white/5 border border-white/10 p-5 rounded-sm focus:border-gold outline-none transition-all placeholder:text-white/10" placeholder="Plot No, Building, Area" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold">City</label>
                  <input {...register("city", { required: true })} className="w-full bg-white/5 border border-white/10 p-5 rounded-sm focus:border-gold outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold">State</label>
                  <input {...register("state", { required: true })} className="w-full bg-white/5 border border-white/10 p-5 rounded-sm focus:border-gold outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold">Pincode</label>
                  <input {...register("pincode", { required: true, minLength: 6, maxLength: 6 })} className="w-full bg-white/5 border border-white/10 p-5 rounded-sm focus:border-gold outline-none transition-all" />
                </div>
              </div>

              <div className="pt-12">
                <h3 className="text-xl font-display font-bold mb-8 text-gold-gradient uppercase tracking-widest">Payment Methodology</h3>
                <div className="grid grid-cols-1 gap-6">
                  <label className="relative flex flex-col p-8 bg-white/5 border border-white/10 rounded-sm cursor-pointer hover:border-gold/50 transition-all group">
                    <div className="flex items-center gap-4 mb-6">
                      <input type="radio" value="Online" {...register("paymentMethod", { required: true })} className="accent-gold" />
                      <div className="flex gap-3">
                        <Smartphone size={20} className="text-gold" />
                        <CreditCard size={20} className="text-gold" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover:text-gold">Secure Online Payment (UPI, Cards)</span>
                    </div>
                    
                    {/* UPI Details */}
                    <div className="mt-4 p-8 bg-black border border-gold/20 rounded-sm space-y-8">
                       <div className="flex justify-between items-center border-b border-gold/10 pb-6">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2 font-bold">Merchant UPI ID</p>
                            <p className="text-xl font-mono font-bold text-gold-gradient tracking-tight">8305103304@upi</p>
                          </div>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              navigator.clipboard.writeText("8305103304@upi");
                              alert("UPI ID Copied to Sanctuary");
                            }}
                            className="px-4 py-2 border border-gold/30 text-[10px] font-bold uppercase tracking-widest text-gold hover:bg-gold hover:text-black transition-all"
                          >
                            Copy ID
                          </button>
                       </div>

                       <div className="flex flex-col items-center gap-6">
                          <div className="bg-white p-4 rounded-sm shadow-2xl relative group">
                             <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=8305103304@upi%26pn=Heavens%20Wellness%26am=${(total + (total > 2000 ? 0 : 150))}%26cu=INR`} 
                                alt="UPI Payment QR" 
                                className="w-48 h-48"
                             />
                             <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4 text-center">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-gold leading-relaxed">
                                   DEMO ONLY<br/>NOT FOR PAYMENT
                                </span>
                             </div>
                          </div>
                          <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-bold">Scan with Google Pay, PhonePe, or Paytm</p>
                       </div>
                    </div>
                  </label>

                  <label className="relative flex items-center gap-4 p-8 bg-white/5 border border-white/10 rounded-sm cursor-pointer hover:border-gold/50 transition-all group">
                    <input type="radio" value="COD" {...register("paymentMethod", { required: true })} className="accent-gold" />
                    <Wallet size={20} className="text-gold" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover:text-gold">Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full gold-shimmer text-black py-6 rounded-sm font-bold uppercase tracking-[0.3em] mt-16 hover:scale-[1.02] transition-all flex items-center justify-center gap-4 disabled:opacity-30 shadow-2xl shadow-gold/20"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                {isSubmitting ? 'Authenticating...' : 'Confirm Indulgence'}
              </button>
            </form>
          </motion.div>

          {/* Summary */}
          <div className="lg:sticky lg:top-32 h-fit">
            <h2 className="text-2xl font-display font-bold mb-10 text-white/40 uppercase tracking-[0.2em]">The Selection</h2>
            <div className="bg-[#0A0A0A] border border-gold/10 p-10 rounded-sm shadow-2xl">
              <div className="space-y-8 mb-10 border-b border-gold/10 pb-10 max-h-[400px] overflow-y-auto pr-4 scrollbar-thin">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex gap-6">
                      <div className="w-16 h-16 bg-white/5 border border-white/5 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="font-bold text-lg font-display tracking-tight leading-tight mb-1">{item.name}</p>
                        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-gold-gradient">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-5 text-sm">
                <div className="flex justify-between text-white/50 uppercase tracking-widest text-[10px] font-bold">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-white/50 uppercase tracking-widest text-[10px] font-bold">
                  <span>Premium Shipping</span>
                  <span className={total > 2000 ? 'text-emerald-500' : ''}>{total > 2000 ? 'COMPLIMENTARY' : '₹150'}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold pt-8 text-gold-gradient font-mono border-t border-gold/5 mt-4">
                  <span className="font-display uppercase tracking-widest text-lg">Total</span>
                  <span>₹{(total + (total > 2000 ? 0 : 150)).toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="mt-16 space-y-6">
                <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold">
                  <Truck size={16} className="text-gold" /> 
                  White-glove delivery in 2-4 business days
                </div>
                <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold">
                  <CreditCard size={16} className="text-gold" /> 
                  Tier-1 encrypted transaction engine
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

