import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Truck, MapPin, Calendar, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Success() {
  const { lastOrder } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    if (!lastOrder) {
        navigate('/');
    }
  }, [lastOrder, navigate]);

  if (!lastOrder) return null;

  const subtotal = lastOrder.total;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden animate-fade-in">
        
        {/* Header / Success Message */}
        <div className="bg-gray-900 text-white p-8 text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm border border-white/20">
                <CheckCircle className="text-green-400 w-12 h-12" />
              </div>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Order Confirmed</h1>
            <p className="text-gray-300 font-light">Thank you for your purchase, {lastOrder.customerName.split(' ')[0]}.</p>
            <div className="mt-6 inline-flex items-center bg-green-900/50 border border-green-500/30 px-4 py-2 rounded-full text-sm font-medium text-green-100">
               <CheckCircle size={14} className="mr-2 text-green-400" /> Payment Successful
            </div>
          </div>
          {/* Decorative background element */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-800 to-gray-900 opacity-50 z-0"></div>
        </div>

        <div className="p-8">
          
          {/* Order Meta Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 pb-8 border-b border-gray-100">
             <div className="space-y-5">
               <div>
                 <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Order Number</p>
                 <p className="text-lg font-bold text-gray-900">#{lastOrder.id.toUpperCase()}</p>
               </div>
               <div>
                 <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Date</p>
                 <div className="flex items-center text-gray-700 font-medium">
                   <Calendar size={16} className="mr-2 text-gray-400" />
                   {new Date(lastOrder.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                 </div>
               </div>
               <div>
                 <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Payment Method</p>
                 <div className="flex items-center text-gray-700 font-medium">
                   <CreditCard size={16} className="mr-2 text-gray-400" />
                   Credit Card (Stripe)
                 </div>
               </div>
             </div>
             
             <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Shipping To</p>
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 h-full">
                   <div className="flex items-start">
                     <MapPin size={20} className="mt-0.5 mr-3 text-amber-600 flex-shrink-0" />
                     <div className="text-sm text-gray-600">
                       <p className="font-bold text-gray-900 mb-1 text-base">{lastOrder.customerName}</p>
                       <p className="leading-relaxed">{lastOrder.shippingAddress}</p>
                       <p className="mt-3 text-gray-400 text-xs">{lastOrder.email}</p>
                     </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Items Summary */}
          <div className="mb-10">
            <h3 className="font-serif text-xl text-gray-900 mb-6 flex items-center">
               <ShoppingBag size={20} className="mr-2 text-amber-600" /> Order Summary
            </h3>
            <div className="space-y-4">
              {lastOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0">
                  <div className="h-20 w-20 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{item.name}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.category}</p>
                    {item.selectedVariant && (
                        <p className="text-xs text-gray-500 bg-gray-100 inline-block px-2 py-0.5 rounded">
                          {Object.entries(item.selectedVariant.options).map(([k, v]) => `${k}: ${v}`).join(' / ')}
                        </p>
                    )}
                  </div>
                  <div className="text-right pl-4">
                    <p className="text-sm font-bold text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Totals */}
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-bold uppercase text-xs tracking-wider">Free Standard Shipping</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (8%)</span>
                <span className="font-medium">₦{tax.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-100 mt-4">
                <span>Total</span>
                <span>₦{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Shipping Notice */}
          <div className="bg-amber-50 border border-amber-100 p-6 rounded-lg mb-10 flex items-start">
             <div className="bg-white p-2 rounded-full shadow-sm mr-4 flex-shrink-0 text-amber-600">
               <Truck size={24} />
             </div>
             <div>
               <h4 className="font-bold text-amber-900 text-sm uppercase tracking-wide mb-2">Estimated Delivery</h4>
               <p className="text-sm text-amber-800/80 leading-relaxed">
                 Your order is being meticulously prepared. It will be shipped within <strong>1-2 business days</strong>. 
                 You will receive a confirmation email with a tracking number as soon as your package leaves our boutique.
               </p>
             </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 uppercase tracking-widest text-sm font-bold hover:bg-amber-600 transition-all shadow-md hover:shadow-lg rounded-sm flex-1 sm:flex-none"
            >
              Continue Shopping <ArrowRight size={16} className="ml-2" />
            </Link>
            <Link 
              to="/account" 
              className="inline-flex items-center justify-center bg-white border border-gray-200 text-gray-700 px-8 py-4 uppercase tracking-widest text-sm font-bold hover:bg-gray-50 hover:text-gray-900 transition-colors rounded-sm flex-1 sm:flex-none"
            >
              View Order History
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}