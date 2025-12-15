import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useShop();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect admins away from cart
  React.useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  if (isAdmin) return null;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="font-serif text-3xl text-gray-900 mb-4">Your Bag is Empty</h2>
        <p className="text-gray-500 mb-8 font-light">Looks like you haven't found your perfect piece yet.</p>
        <Link 
          to="/shop" 
          className="bg-gray-900 text-white px-8 py-3 uppercase tracking-widest text-xs font-bold hover:bg-amber-600 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-12 pb-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-12 text-center">Shopping Bag</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-8">
            {cart.map(item => (
              <div key={item.cartItemId} className="flex gap-6 py-6 border-b border-gray-100 last:border-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif text-lg text-gray-900 mb-1">
                        <Link to={`/product/${item.id}`} className="hover:text-amber-700">{item.name}</Link>
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">{item.category}</p>
                      {/* Variant Display */}
                      {item.selectedVariant && (
                        <div className="text-xs text-gray-600 bg-gray-50 inline-block px-2 py-1 rounded border border-gray-100">
                           {Object.entries(item.selectedVariant.options).map(([key, val]) => (
                             <span key={key} className="mr-3 last:mr-0">
                               <span className="font-bold text-gray-500">{key}:</span> {val}
                             </span>
                           ))}
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-gray-200">
                      <button 
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-gray-400 hover:text-red-500 transition-colors text-sm flex items-center"
                    >
                      <Trash2 size={16} className="mr-1" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-8 sticky top-24">
              <h2 className="font-serif text-xl text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (Estimated)</span>
                  <span>₦{(cartTotal * 0.08).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-8">
                <span className="font-bold text-gray-900 text-lg">Total</span>
                <span className="font-bold text-gray-900 text-lg">
                  ₦{(cartTotal * 1.08).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-gray-900 text-white py-4 uppercase tracking-widest text-sm font-bold hover:bg-amber-600 transition-colors flex items-center justify-center group"
              >
                Proceed to Checkout <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="mt-6 text-xs text-gray-400 text-center">
                 <p>Secure Checkout by Stripe</p>
                 <div className="flex justify-center gap-2 mt-2 opacity-50">
                    <div className="w-8 h-5 bg-gray-300 rounded"></div>
                    <div className="w-8 h-5 bg-gray-300 rounded"></div>
                    <div className="w-8 h-5 bg-gray-300 rounded"></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
