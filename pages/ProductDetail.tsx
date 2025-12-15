import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, ChevronLeft, Lock, AlertCircle, ArrowDown, X } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useShop();
  const { isAdmin } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);
  
  // Variant Selection State
  const [selectedOptions, setSelectedOptions] = useState<{[key: string]: string}>({});

  const product = products.find(p => p.id === id);

  useEffect(() => {
    // Reset options when product changes
    setSelectedOptions({});
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif text-gray-900 mb-4">Product Not Found</h2>
        <button onClick={() => navigate('/shop')} className="text-amber-600 underline">Back to Shop</button>
      </div>
    );
  }

  // 1. Get all available option keys (e.g. ["Size", "Material"]) from variants
  const optionKeys = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return [];
    const keys = new Set<string>();
    product.variants.forEach(v => {
      Object.keys(v.options).forEach(k => keys.add(k));
    });
    // Sort keys to ensure consistent order (e.g. Size then Color)
    return Array.from(keys).sort(); 
  }, [product]);

  // 2. Get all possible values for a specific key (e.g. Size: ["6", "7", "8"])
  const getValuesForKey = (key: string) => {
    if (!product.variants) return [];
    const values = new Set<string>();
    product.variants.forEach(v => {
      if (v.options[key]) values.add(v.options[key]);
    });
    // Sort values naturally (numeric or alphabetic)
    return Array.from(values).sort((a, b) => {
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.localeCompare(b);
    });
  };

  // 3. Check availability of a specific option value given the *other* currently selected options
  const getOptionStatus = (key: string, value: string) => {
    if (!product.variants) return { available: true, stock: product.stock };

    // Filter variants that match all selected options *except* the current key
    const compatibleVariants = product.variants.filter(v => {
      return optionKeys.every(k => {
        // If checking current key, we look for variants with the specific value we are testing
        if (k === key) return v.options[k] === value;
        // For other keys, if a selection exists, the variant must match it
        if (selectedOptions[k]) return v.options[k] === selectedOptions[k];
        // If no selection for that key yet, any value is fine
        return true;
      });
    });

    if (compatibleVariants.length === 0) {
        return { available: false, stock: 0 }; // Combination doesn't exist
    }

    // Sum stock of compatible variants
    const totalStock = compatibleVariants.reduce((sum, v) => sum + v.stock, 0);
    return { available: true, stock: totalStock };
  };

  // 4. Find the exact variant that matches ALL selected options
  const selectedVariant = useMemo(() => {
    if (!product.variants || optionKeys.length === 0) return undefined;
    
    // Check if all keys are selected
    const allSelected = optionKeys.every(key => selectedOptions[key]);
    if (!allSelected) return undefined;

    return product.variants.find(v => 
      optionKeys.every(key => v.options[key] === selectedOptions[key])
    );
  }, [product, optionKeys, selectedOptions]);

  const handleOptionSelect = (key: string, value: string) => {
    const status = getOptionStatus(key, value);
    if (!status.available) return; // Prevent selecting invalid combinations

    // Update selection
    setSelectedOptions(prev => {
        const next = { ...prev, [key]: value };
        return next;
    });
  };

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stock : (product.variants ? 0 : product.stock);
  const isSoldOut = product.variants && product.variants.length > 0 && selectedVariant ? currentStock === 0 : product.stock === 0;

  // Determining if we can add to cart
  const needsSelection = product.variants && product.variants.length > 0 && !selectedVariant;
  const canAddToCart = !needsSelection && !isSoldOut;

  const handleAddToCart = () => {
    if (needsSelection) {
      optionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!canAddToCart) return;
    
    setIsAdding(true);
    addToCart(product, selectedVariant);
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="pt-4 pb-32 md:pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-6 text-sm uppercase tracking-wider"
        >
          <ChevronLeft size={16} className="mr-1" /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-20 items-start">
          
          {/* Image */}
          <div className="bg-gray-50 aspect-square overflow-hidden relative group cursor-zoom-in rounded-lg md:rounded-none">
             <img 
               src={product.image} 
               alt={product.name} 
               className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-125 origin-center"
             />
             {!selectedVariant && product.variants && (
               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm">
                 Multiple Options
               </div>
             )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center h-full pt-4">
            <span className="text-amber-600 uppercase tracking-widest text-xs font-bold mb-2">
              {product.category}
            </span>
            <h1 className="font-serif text-3xl md:text-5xl text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>
            <p className="text-xl md:text-2xl text-gray-900 font-light mb-6 transition-all duration-300">
              ₦{currentPrice.toLocaleString()}
            </p>

            <div className="prose prose-sm text-gray-500 mb-8 leading-relaxed font-light">
              <p>{product.description}</p>
            </div>

            {/* Variants Selector */}
            <div ref={optionsRef}>
              {product.variants && optionKeys.length > 0 && (
                <div className="space-y-6 mb-10 border-t border-gray-100 pt-6">
                  {optionKeys.map(key => (
                    <div key={key}>
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-900 block mb-3">
                        Select {key}: <span className="text-amber-600 ml-1">{selectedOptions[key]}</span>
                      </span>
                      <div className="flex flex-wrap gap-3">
                        {getValuesForKey(key).map(value => {
                          const isSelected = selectedOptions[key] === value;
                          const { available, stock } = getOptionStatus(key, value);
                          const isOutOfStock = available && stock === 0;
                          
                          return (
                            <button
                              key={value}
                              onClick={() => handleOptionSelect(key, value)}
                              disabled={!available && !isSelected} 
                              className={`relative min-w-[3rem] px-4 py-3 text-sm border rounded-sm transition-all duration-200 
                                ${isSelected 
                                  ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-sm' 
                                  : !available
                                    ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white hover:text-gray-900'
                                }
                              `}
                            >
                              {value}
                              {isOutOfStock && !isSelected && (
                                <span className="absolute inset-0 flex items-center justify-center text-gray-300">
                                   <div className="w-full h-px bg-gray-300 rotate-45 absolute" />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-b border-gray-100 py-6 mb-8">
               <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                 <span>Availability</span>
                 {needsSelection ? (
                    <span className="text-gray-400">Select options to see stock</span>
                 ) : (
                    <span className={!isSoldOut ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                      {!isSoldOut ? `${currentStock} in stock` : "Out of Stock"}
                    </span>
                 )}
               </div>
               <div className="flex items-center justify-between text-sm text-gray-600">
                 <span>Shipping</span>
                 <span>Free Standard Shipping</span>
               </div>
            </div>

            {/* Desktop Add to Cart Button */}
            <div className="hidden md:block">
              {isAdmin ? (
                 <div className="bg-gray-100 text-gray-500 py-4 px-6 text-center text-sm font-medium flex items-center justify-center">
                   <Lock size={16} className="mr-2" /> Admin View - Purchasing Disabled
                 </div>
              ) : (
                <div className="space-y-3">
                  <button 
                    onClick={handleAddToCart}
                    disabled={(!canAddToCart && !needsSelection) || isAdding}
                    className={`w-full py-4 px-6 flex items-center justify-center uppercase tracking-widest text-sm font-bold transition-all duration-300 ${
                      !canAddToCart && !needsSelection
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : isAdding 
                          ? 'bg-green-700 text-white'
                          : 'bg-gray-900 text-white hover:bg-amber-600'
                    }`}
                  >
                    {needsSelection ? (
                      'Select Options'
                    ) : isSoldOut ? (
                      'Sold Out'
                    ) : isAdding ? (
                      'Added to Cart'
                    ) : (
                      <>
                        <ShoppingBag size={18} className="mr-3" /> Add to Cart
                      </>
                    )}
                  </button>
                  {needsSelection && (
                     <p className="text-xs text-amber-600 text-center flex items-center justify-center">
                       <AlertCircle size={12} className="mr-1" /> Please select all options above
                     </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-30 safe-area-bottom">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
           <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase">Total</span>
              <span className="font-serif text-lg font-bold text-gray-900">₦{currentPrice.toLocaleString()}</span>
           </div>
           
           {isAdmin ? (
              <div className="bg-gray-100 text-gray-500 px-6 py-3 rounded text-xs font-bold uppercase tracking-wide">
                Admin Mode
              </div>
           ) : (
             <button 
                onClick={handleAddToCart}
                disabled={(!canAddToCart && !needsSelection) || isAdding}
                className={`flex-1 py-3 px-4 rounded text-sm font-bold uppercase tracking-wide shadow-sm flex items-center justify-center ${
                  !canAddToCart && !needsSelection
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : isAdding 
                      ? 'bg-green-700 text-white'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {needsSelection ? (
                  <>Select Options <ArrowDown size={16} className="ml-2" /></>
                ) : isSoldOut ? (
                  'Sold Out'
                ) : isAdding ? (
                  'Added'
                ) : (
                  <>Add to Cart</>
                )}
              </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
