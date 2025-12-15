import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { Category, Product, OrderStatus, Variant, Order } from '../types';
import { generateProductDescription } from '../services/geminiService';
import { Trash2, Edit2, Plus, Sparkles, Loader, ShoppingBag, Tag, ChevronDown, Clock, X, Eye, MapPin, CreditCard, Package, Truck, CheckCircle } from 'lucide-react';

const Admin: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, getAllOrders, updateOrderStatus } = useShop();
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const [formData, setFormData] = useState<Product>({
    id: '',
    name: '',
    price: 0,
    description: '',
    category: Category.Rings,
    image: 'https://picsum.photos/400/400',
    stock: 10,
    variants: []
  });

  // State for new variant entry
  const [newVariant, setNewVariant] = useState({
    name: '',
    price: 0,
    stock: 0,
    optionsStr: '' // "Size:7, Material:Gold"
  });

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin || !user) return null;

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      price: 0,
      description: '',
      category: Category.Rings,
      image: 'https://picsum.photos/400/400',
      stock: 10,
      variants: []
    });
    setEditingId(null);
    setShowForm(false);
    setNewVariant({ name: '', price: 0, stock: 0, optionsStr: '' });
  };

  const handleEdit = (product: Product) => {
    setFormData({ ...product, variants: product.variants || [] });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduct(formData);
    } else {
      addProduct({ ...formData, id: Date.now().toString() });
    }
    resetForm();
  };

  const handleAI = async () => {
    if (!formData.name) {
      alert("Please enter a product name first.");
      return;
    }
    
    setIsGenerating(true);
    const desc = await generateProductDescription(
      formData.name, 
      formData.category, 
      "luxury, handmade, gold, premium"
    );
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const addVariant = () => {
    if (!newVariant.name || !newVariant.optionsStr) return;
    
    // Parse options string "Size:7, Material:Gold"
    const options: { [key: string]: string } = {};
    newVariant.optionsStr.split(',').forEach(part => {
      const [key, val] = part.split(':').map(s => s.trim());
      if (key && val) options[key] = val;
    });

    const variant: Variant = {
      id: Date.now().toString(),
      name: newVariant.name,
      price: Number(newVariant.price) || formData.price,
      stock: Number(newVariant.stock),
      options
    };

    setFormData(prev => ({
      ...prev,
      variants: [...(prev.variants || []), variant]
    }));
    
    setNewVariant({ name: '', price: 0, stock: 0, optionsStr: '' });
  };

  const removeVariant = (variantId: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants?.filter(v => v.id !== variantId)
    }));
  };

  const orders = getAllOrders();

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PendingPayment: return 'bg-gray-100 text-gray-800 border-gray-200';
      case OrderStatus.Paid: return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case OrderStatus.Processing: return 'bg-amber-50 text-amber-700 border-amber-100';
      case OrderStatus.Shipped: return 'bg-blue-50 text-blue-700 border-blue-100';
      case OrderStatus.Delivered: return 'bg-green-50 text-green-700 border-green-100';
      case OrderStatus.Cancelled: return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const handleUpdateStatus = (status: OrderStatus) => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, status);
      // Optimistically update local state for the modal
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-serif text-3xl text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {user.name}</p>
          </div>
          
          {/* Tabs */}
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
             <button 
               onClick={() => setActiveTab('products')}
               className={`px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'products' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
             >
               <Tag size={16} /> Products
             </button>
             <button 
               onClick={() => setActiveTab('orders')}
               className={`px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'orders' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
             >
               <ShoppingBag size={16} /> Orders
             </button>
          </div>
        </div>

        {activeTab === 'products' ? (
          <>
            <div className="flex justify-end mb-6">
              <button 
                onClick={() => { resetForm(); setShowForm(true); }}
                className="bg-gray-900 text-white px-6 py-3 rounded flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-sm text-sm font-bold uppercase tracking-wide"
              >
                <Plus size={18} /> Add New Product
              </button>
            </div>

            {/* Form Modal/Section */}
            {showForm && (
              <div className="bg-white p-8 rounded-lg shadow-sm mb-12 border border-gray-200 animate-fade-in relative">
                 <button onClick={resetForm} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                   <X size={24} />
                 </button>
                <h2 className="text-xl font-bold mb-6 font-serif">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                      <input 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full p-2 border rounded focus:ring-amber-500 focus:border-amber-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₦)</label>
                        <input 
                          type="number"
                          value={formData.price} 
                          onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                          className="w-full p-2 border rounded focus:ring-amber-500 focus:border-amber-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Base Stock</label>
                        <input 
                          type="number"
                          value={formData.stock} 
                          onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                          className="w-full p-2 border rounded focus:ring-amber-500 focus:border-amber-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select 
                        value={formData.category} 
                        onChange={e => setFormData({...formData, category: e.target.value as Category})}
                        className="w-full p-2 border rounded focus:ring-amber-500 focus:border-amber-500"
                      >
                        {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <button 
                          type="button" 
                          onClick={handleAI}
                          disabled={isGenerating || !formData.name}
                          className={`text-xs flex items-center gap-1 ${isGenerating || !formData.name ? 'text-gray-400 cursor-not-allowed' : 'text-amber-600 hover:text-amber-800'}`}
                        >
                          {isGenerating ? <Loader size={12} className="animate-spin" /> : <Sparkles size={12} />}
                          Generate with AI
                        </button>
                      </div>
                      <textarea 
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        rows={4}
                        className="w-full p-2 border rounded focus:ring-amber-500 focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Right Column: Variants & Image */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input 
                        value={formData.image} 
                        onChange={e => setFormData({...formData, image: e.target.value})}
                        className="w-full p-2 border rounded focus:ring-amber-500 focus:border-amber-500"
                        required
                      />
                      {formData.image && (
                        <img src={formData.image} alt="Preview" className="w-16 h-16 object-cover mt-2 rounded border" />
                      )}
                    </div>

                    {/* Variant Manager */}
                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                      <h3 className="font-medium text-gray-900 mb-3 text-sm">Product Variants</h3>
                      
                      {/* Existing Variants List */}
                      <div className="space-y-2 mb-4">
                        {formData.variants && formData.variants.length > 0 ? (
                           formData.variants.map((v) => (
                             <div key={v.id} className="flex items-center justify-between bg-white p-2 border border-gray-100 text-sm">
                               <div>
                                 <span className="font-bold">{v.name}</span>
                                 <span className="text-gray-500 ml-2">({v.stock} in stock) - ₦{v.price}</span>
                                 <div className="text-xs text-gray-400">
                                   {Object.entries(v.options).map(([k, val]) => `${k}:${val}`).join(', ')}
                                 </div>
                               </div>
                               <button 
                                 type="button" 
                                 onClick={() => removeVariant(v.id)}
                                 className="text-red-500 hover:text-red-700"
                               >
                                 <X size={14} />
                               </button>
                             </div>
                           ))
                        ) : (
                          <p className="text-xs text-gray-400 italic">No variants added (using base stock).</p>
                        )}
                      </div>

                      {/* Add Variant Form */}
                      <div className="grid grid-cols-2 gap-2 mb-2">
                         <input 
                           placeholder="Name (e.g. Size 7 - Gold)"
                           className="p-1 border rounded text-xs col-span-2"
                           value={newVariant.name}
                           onChange={e => setNewVariant({...newVariant, name: e.target.value})}
                         />
                         <input 
                           placeholder="Price Override (Optional)"
                           type="number"
                           className="p-1 border rounded text-xs"
                           value={newVariant.price || ''}
                           onChange={e => setNewVariant({...newVariant, price: Number(e.target.value)})}
                         />
                         <input 
                           placeholder="Stock"
                           type="number"
                           className="p-1 border rounded text-xs"
                           value={newVariant.stock || ''}
                           onChange={e => setNewVariant({...newVariant, stock: Number(e.target.value)})}
                         />
                         <input 
                           placeholder="Options (e.g. Size:7, Material:Gold)"
                           className="p-1 border rounded text-xs col-span-2"
                           value={newVariant.optionsStr}
                           onChange={e => setNewVariant({...newVariant, optionsStr: e.target.value})}
                         />
                      </div>
                      <button 
                        type="button" 
                        onClick={addVariant}
                        className="w-full py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded"
                      >
                        + Add Variant
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex justify-end gap-3 mt-4 border-t pt-4">
                    <button type="button" onClick={resetForm} className="px-6 py-2 border rounded hover:bg-gray-50 text-sm font-medium">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 text-sm font-bold uppercase tracking-wide">
                      {editingId ? 'Update Product' : 'Create Product'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Product Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map(product => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full object-cover border border-gray-200" src={product.image} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            {product.variants && product.variants.length > 0 && (
                              <span className="text-xs text-amber-600 bg-amber-50 px-1 rounded">{product.variants.length} Variants</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₦{product.price.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.stock > 5 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEdit(product)} className="text-amber-600 hover:text-amber-900 mr-4">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => deleteProduct(product.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          /* Orders Tab */
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            {orders.length === 0 ? (
               <div className="text-center py-12">
                 <p className="text-gray-500">No orders found.</p>
               </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id.toUpperCase().slice(0, 8)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-xs">{order.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">₦{(order.total * 1.08).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold uppercase tracking-wider rounded-full border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="text-gray-500 hover:text-amber-600 transition-colors flex items-center justify-end gap-1 ml-auto"
                        >
                          <Eye size={16} /> <span className="text-xs uppercase font-bold tracking-wider">View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
                 <div>
                    <h2 className="font-serif text-2xl text-gray-900">Order #{selectedOrder.id.toUpperCase()}</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Placed on {new Date(selectedOrder.date).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}
                    </p>
                 </div>
                 <button 
                    onClick={() => setSelectedOrder(null)} 
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                 >
                   <X size={24} />
                 </button>
              </div>
              
              <div className="p-8 space-y-8">
                 {/* Status Control Panel */}
                 <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                       <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Current Status</p>
                       <div className="relative inline-block text-left">
                          <select 
                            value={selectedOrder.status}
                            onChange={(e) => handleUpdateStatus(e.target.value as OrderStatus)}
                            className={`appearance-none block w-full pl-3 pr-8 py-2 text-sm font-bold rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 border ${getStatusColor(selectedOrder.status)}`}
                          >
                             {Object.values(OrderStatus).map(status => (
                               <option key={status} value={status}>{status}</option>
                             ))}
                          </select>
                           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                             <ChevronDown size={14} />
                           </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                       {/* Fulfillment Quick Actions */}
                       {(selectedOrder.status === OrderStatus.Paid || selectedOrder.status === OrderStatus.Processing) && (
                         <button 
                           onClick={() => handleUpdateStatus(OrderStatus.Shipped)}
                           className="flex items-center bg-gray-900 text-white px-5 py-2.5 rounded text-xs font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-sm"
                         >
                            <Truck size={16} className="mr-2" /> Mark as Fulfilled
                         </button>
                       )}
                       {selectedOrder.status === OrderStatus.Shipped && (
                          <button 
                            onClick={() => handleUpdateStatus(OrderStatus.Delivered)}
                            className="flex items-center bg-green-700 text-white px-5 py-2.5 rounded text-xs font-bold uppercase tracking-widest hover:bg-green-800 transition-colors shadow-sm"
                          >
                             <CheckCircle size={16} className="mr-2" /> Mark as Delivered
                          </button>
                       )}
                    </div>
                 </div>

                 {/* Customer & Shipping Info Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Shipping Address */}
                    <div>
                       <h3 className="flex items-center text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">
                          <MapPin size={16} className="mr-2 text-amber-600" /> Shipping Details
                       </h3>
                       <div className="text-sm text-gray-600 space-y-1">
                          <p className="font-bold text-gray-900 text-base">{selectedOrder.customerName}</p>
                          <p className="leading-relaxed">{selectedOrder.shippingAddress}</p>
                          <p className="text-gray-400 mt-2 text-xs">{selectedOrder.email}</p>
                       </div>
                    </div>

                    {/* Payment Details */}
                    <div>
                       <h3 className="flex items-center text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">
                          <CreditCard size={16} className="mr-2 text-amber-600" /> Payment Information
                       </h3>
                       <div className="space-y-3 text-sm">
                          <div className="flex justify-between border-b border-gray-50 pb-2">
                             <span className="text-gray-500">Payment Status</span>
                             <span className={`font-bold ${
                                selectedOrder.status !== OrderStatus.PendingPayment && selectedOrder.status !== OrderStatus.Cancelled 
                                ? "text-green-600" 
                                : "text-gray-500"
                             }`}>
                                {selectedOrder.status === OrderStatus.PendingPayment ? 'Pending' : 'Paid'}
                             </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-50 pb-2">
                             <span className="text-gray-500">Method</span>
                             <span className="text-gray-900">Stripe (Credit Card)</span>
                          </div>
                          <div className="flex justify-between">
                             <span className="text-gray-500">Transaction ID</span>
                             <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 select-all">
                                {selectedOrder.paymentId || 'N/A'}
                             </span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Order Items Table */}
                 <div>
                    <h3 className="flex items-center text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">
                       <Package size={16} className="mr-2 text-amber-600" /> Order Items ({selectedOrder.items.length})
                    </h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                       <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-wider">
                             <tr>
                                <th className="px-6 py-3">Product</th>
                                <th className="px-6 py-3 text-center">Qty</th>
                                <th className="px-6 py-3 text-right">Price</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 bg-white">
                             {selectedOrder.items.map((item, i) => (
                                <tr key={i}>
                                   <td className="px-6 py-4">
                                      <div className="flex items-center">
                                         <div className="h-12 w-12 flex-shrink-0 border border-gray-200 rounded overflow-hidden">
                                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                         </div>
                                         <div className="ml-4">
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            {item.selectedVariant && (
                                               <p className="text-xs text-gray-500 mt-0.5">
                                                  {Object.entries(item.selectedVariant.options).map(([k, v]) => `${k}: ${v}`).join(' / ')}
                                               </p>
                                            )}
                                         </div>
                                      </div>
                                   </td>
                                   <td className="px-6 py-4 text-center text-gray-600">{item.quantity}</td>
                                   <td className="px-6 py-4 text-right font-medium text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                             ))}
                          </tbody>
                          <tfoot className="bg-gray-50">
                             <tr>
                                <td colSpan={2} className="px-6 py-4 text-right font-bold text-gray-700">Subtotal</td>
                                <td className="px-6 py-4 text-right text-gray-700">₦{selectedOrder.total.toLocaleString()}</td>
                             </tr>
                             <tr>
                                <td colSpan={2} className="px-6 py-2 text-right font-bold text-gray-700">Tax (8%)</td>
                                <td className="px-6 py-2 text-right text-gray-700">₦{(selectedOrder.total * 0.08).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                             </tr>
                             <tr className="border-t border-gray-200">
                                <td colSpan={2} className="px-6 py-4 text-right font-bold text-lg text-gray-900">Total</td>
                                <td className="px-6 py-4 text-right font-bold text-lg text-gray-900">₦{(selectedOrder.total * 1.08).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                             </tr>
                          </tfoot>
                       </table>
                    </div>
                 </div>
              </div>
           </div>
        </div>
     )}
    </div>
  );
};

export default Admin;