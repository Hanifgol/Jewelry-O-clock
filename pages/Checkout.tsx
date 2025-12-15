import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

const Checkout: React.FC = () => {
  const { cartTotal, cart, placeOrder } = useShop();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    card: '',
    expiry: '',
    cvc: ''
  });

  // Redirect if not authenticated or if admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
    } else if (isAdmin) {
      navigate('/admin');
    }
  }, [isAuthenticated, isAdmin, navigate, location]);

  useEffect(() => {
    if (user) {
      const names = user.name.split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || ''
      }));
    }
  }, [user]);

  // If admin, render nothing while redirecting
  if (isAdmin) return null;

  if (cart.length === 0) {
    if (isAuthenticated) navigate('/cart');
    return null;
  }
  
  if (!isAuthenticated) return null; // Wait for redirect

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsProcessing(true);

    try {
      // Simulate Stripe Payment processing
      // In a real application, you would integrate Stripe Elements here and wait for confirmation
      const mockPaymentId = `pi_${Math.random().toString(36).substr(2, 9)}_mock_${Date.now()}`;

      await placeOrder({ 
        userId: user.id,
        name: `${formData.firstName} ${formData.lastName}`, 
        email: user.email,
        address: `${formData.address}, ${formData.city} ${formData.zip}`,
        paymentId: mockPaymentId
      });
      
      navigate('/success');
    } catch (error: any) {
      console.error(error);
      alert(`Order processing failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const total = (cartTotal * 1.08);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl text-gray-900 mb-8 text-center">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Form */}
          <div className="bg-white p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Contact Information</h3>
                <div className="space-y-4">
                  <div className="w-full p-3 border border-gray-200 bg-gray-50 text-gray-500">
                    {user?.email} <span className="text-xs ml-2">(Logged in)</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 mt-8 uppercase tracking-wider text-sm">Shipping Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input required name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="w-full p-3 border border-gray-200 focus:outline-none focus:border-amber-600 transition-colors" />
                  <input required name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="w-full p-3 border border-gray-200 focus:outline-none focus:border-amber-600 transition-colors" />
                </div>
                <input required name="address" placeholder="Address" onChange={handleChange} className="w-full mt-4 p-3 border border-gray-200 focus:outline-none focus:border-amber-600 transition-colors" />
                <div className="grid grid-cols-2 gap-4 mt-4">
                   <input required name="city" placeholder="City" onChange={handleChange} className="w-full p-3 border border-gray-200 focus:outline-none focus:border-amber-600 transition-colors" />
                   <input required name="zip" placeholder="ZIP Code" onChange={handleChange} className="w-full p-3 border border-gray-200 focus:outline-none focus:border-amber-600 transition-colors" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 mt-8 uppercase tracking-wider text-sm flex items-center">
                  Payment <Lock size={14} className="ml-2 text-gray-400" />
                </h3>
                <div className="space-y-4 bg-gray-50 p-4 border border-gray-200">
                  <input required name="card" placeholder="Card Number" className="w-full p-3 border border-gray-200 focus:outline-none focus:border-amber-600 transition-colors bg-white" />
                  <div className="grid grid-cols-2 gap-4">
                    <input required name="expiry" placeholder="MM / YY" className="w-full p-3 border border-gray-200 focus:outline-none focus:border-amber-600 transition-colors bg-white" />
                    <input required name="cvc" placeholder="CVC" className="w-full p-3 border border-gray-200 focus:outline-none focus:border-amber-600 transition-colors bg-white" />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full bg-[#635bff] hover:bg-[#544de3] text-white py-4 font-bold text-lg rounded shadow-sm transition-colors mt-8 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                 {isProcessing ? 'Processing Order...' : `Pay ₦${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              </button>
            </form>
          </div>

          {/* Order Preview */}
          <div className="lg:pl-8">
            <div className="bg-white p-8 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Your Order</h3>
              <div className="space-y-4 mb-8">
                {cart.map(item => (
                  <div key={item.cartItemId} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-gray-50 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-2 -right-2 bg-amber-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-serif text-gray-900 text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                      {item.selectedVariant && (
                        <p className="text-xs text-gray-400">
                          {Object.entries(item.selectedVariant.options).map(([k, v]) => `${k}: ${v}`).join(', ')}
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-600">
                 <div className="flex justify-between">
                   <span>Subtotal</span>
                   <span>₦{cartTotal.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Shipping</span>
                   <span>Free</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Taxes (8%)</span>
                   <span>₦{(cartTotal * 0.08).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                 </div>
                 <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg text-gray-900">
                   <span>Total</span>
                   <span>₦{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;