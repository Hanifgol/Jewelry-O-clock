import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { Package, User as UserIcon, LogOut, ChevronDown, ChevronUp, Check, Clock } from 'lucide-react';
import { OrderStatus, Order } from '../types';

const OrderTracker: React.FC<{ order: Order }> = ({ order }) => {
  const steps = [
    { status: OrderStatus.Paid, label: 'Order Paid' },
    { status: OrderStatus.Processing, label: 'Processing' },
    { status: OrderStatus.Shipped, label: 'Shipped' },
    { status: OrderStatus.Delivered, label: 'Delivered' }
  ];

  if (order.status === OrderStatus.Cancelled) {
    return (
      <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex items-center text-red-700 mb-6">
        <div className="mr-3 p-2 bg-red-100 rounded-full">
           <LogOut size={20} className="transform rotate-180" /> 
        </div>
        <div>
           <p className="font-bold">Order Cancelled</p>
           <p className="text-sm">This order has been cancelled. Please contact support if this is a mistake.</p>
        </div>
      </div>
    );
  }

  // Calculate current step index
  let currentIndex = -1;
  if (order.status === OrderStatus.Paid) currentIndex = 0;
  if (order.status === OrderStatus.Processing) currentIndex = 1;
  if (order.status === OrderStatus.Shipped) currentIndex = 2;
  if (order.status === OrderStatus.Delivered) currentIndex = 3;

  // Handle Pending Payment or other edge cases
  if (order.status === OrderStatus.PendingPayment) currentIndex = -1;

  return (
    <div className="py-6 mb-6">
      <div className="relative">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full"></div>
        
        {/* Progress Bar Active */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-amber-500 -translate-y-1/2 rounded-full transition-all duration-500"
          style={{ width: `${Math.max(0, currentIndex / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            
            // Find timestamp for this specific status from history
            const historyEntry = order.statusHistory?.find(h => h.status === step.status);
            const date = historyEntry ? new Date(historyEntry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';

            return (
              <div key={step.status} className="flex flex-col items-center group">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 bg-white ${
                    isCompleted ? 'border-amber-500 text-amber-500' : 'border-gray-200 text-gray-300'
                  }`}
                >
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-gray-200" />}
                </div>
                <div className="absolute top-10 flex flex-col items-center text-center w-24">
                  <span className={`text-xs font-bold mt-2 uppercase tracking-wide transition-colors ${
                    isCompleted ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                  {date && isCompleted && (
                    <span className="text-[10px] text-gray-500 mt-0.5 font-medium">{date}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="h-12"></div> {/* Spacer for labels */}
    </div>
  );
};

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PendingPayment: return 'bg-gray-100 text-gray-600';
      case OrderStatus.Paid: return 'bg-indigo-50 text-indigo-700';
      case OrderStatus.Processing: return 'bg-yellow-50 text-yellow-700';
      case OrderStatus.Shipped: return 'bg-blue-50 text-blue-700';
      case OrderStatus.Delivered: return 'bg-green-50 text-green-700';
      case OrderStatus.Cancelled: return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md bg-white">
      {/* Header */}
      <div 
        className="px-6 py-5 cursor-pointer bg-white"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex gap-8 items-center">
             <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Order ID</p>
                <p className="text-sm font-bold text-gray-900">#{order.id.toUpperCase()}</p>
             </div>
             <div className="hidden sm:block">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Date</p>
                <p className="text-sm text-gray-700">{new Date(order.date).toLocaleDateString()}</p>
             </div>
             <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Total</p>
                <p className="text-sm font-bold text-gray-900">₦{(order.total * 1.08).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-transparent ${getStatusColor(order.status)}`}>
               {order.status}
             </span>
             {expanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-6 py-6 border-t border-gray-100 bg-gray-50/50">
          
          <OrderTracker order={order} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <h4 className="font-serif text-gray-900 mb-4">Items Ordered</h4>
              <div className="space-y-4">
                {order.items.map(item => (
                  <div key={item.cartItemId} className="flex items-center gap-4 bg-white p-3 rounded border border-gray-100">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden bg-gray-100 rounded-sm">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-900 text-sm truncate">{item.name}</h5>
                      <p className="text-xs text-gray-500">{item.category}</p>
                      {item.selectedVariant && (
                        <p className="text-xs text-gray-400 mt-1">
                          {Object.entries(item.selectedVariant.options).map(([k, v]) => `${k}: ${v}`).join(', ')}
                        </p>
                      )}
                      <div className="flex justify-between mt-1 text-xs">
                        <span className="text-gray-500">Qty: {item.quantity}</span>
                        <span className="font-medium">₦{item.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
               <div>
                  <h4 className="font-serif text-gray-900 mb-2">Shipping Details</h4>
                  <div className="bg-white p-4 rounded border border-gray-100 text-sm text-gray-600">
                    <p className="font-bold text-gray-900 mb-1">{order.customerName}</p>
                    <p>{order.shippingAddress}</p>
                    <p className="mt-2 text-xs text-gray-400">Standard Insured Shipping</p>
                  </div>
               </div>
               
               {/* Status History Log (Mini) */}
               <div>
                 <h4 className="font-serif text-gray-900 mb-2">Order Activity</h4>
                 <div className="bg-white p-4 rounded border border-gray-100">
                   <ul className="space-y-3">
                     {[...(order.statusHistory || [])].reverse().map((history, idx) => (
                       <li key={idx} className="flex gap-3 text-sm">
                         <Clock size={16} className="text-gray-300 mt-0.5" />
                         <div>
                           <p className="font-medium text-gray-900">{history.status}</p>
                           <p className="text-xs text-gray-500">{new Date(history.timestamp).toLocaleString()}</p>
                         </div>
                       </li>
                     ))}
                   </ul>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Account: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getUserOrders } = useShop();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

  if (!user || isAdmin) return null;

  const orders = getUserOrders(user.id);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl text-gray-900 mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 shadow-sm mb-6 rounded-lg border border-gray-100">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-amber-50 p-3 rounded-full border border-amber-100">
                  <UserIcon size={24} className="text-amber-700" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{user.name}</h2>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <span className="text-[10px] uppercase bg-gray-100 px-2 py-0.5 rounded text-gray-500 mt-1 inline-block tracking-wider font-bold">Valued Customer</span>
                </div>
              </div>
              <button 
                onClick={() => { logout(); navigate('/login'); }}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <LogOut size={16} className="mr-2" /> Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white p-8 shadow-sm rounded-lg border border-gray-100">
              <div className="flex items-center mb-8">
                <Package className="mr-3 text-amber-600" size={24} />
                <h2 className="font-serif text-xl text-gray-900">Order History</h2>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-lg">
                  <div className="inline-flex bg-gray-50 p-4 rounded-full mb-4">
                     <Package size={32} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-500 mb-6 max-w-xs mx-auto">Discover our collection of fine jewelry and watches.</p>
                  <button onClick={() => navigate('/shop')} className="bg-gray-900 text-white px-6 py-2 rounded text-sm font-bold uppercase tracking-wider hover:bg-amber-600 transition-colors">
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
