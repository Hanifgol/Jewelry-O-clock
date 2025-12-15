import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Category } from '../types';

const Shop: React.FC = () => {
  const { products } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentCategory = searchParams.get('category');

  const filteredProducts = useMemo(() => {
    if (!currentCategory) return products;
    return products.filter(p => p.category === currentCategory);
  }, [products, currentCategory]);

  const categories = Object.keys(Category);

  return (
    <div className="pt-12 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6">
            {currentCategory ? currentCategory : 'All Collections'}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-light">
            Explore our comprehensive collection of fine jewelry, designed to elevate every moment.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button 
            onClick={() => setSearchParams({})}
            className={`px-6 py-2 text-sm uppercase tracking-widest border transition-all ${
              !currentCategory 
                ? 'bg-gray-900 text-white border-gray-900' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
             <button 
              key={cat}
              onClick={() => setSearchParams({ category: cat })}
              className={`px-6 py-2 text-sm uppercase tracking-widest border transition-all ${
                currentCategory === cat 
                  ? 'bg-gray-900 text-white border-gray-900' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <Link key={product.id} to={`/product/${product.id}`} className="group flex flex-col">
                <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                   {product.stock === 0 && (
                     <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="bg-gray-900 text-white px-3 py-1 uppercase text-xs tracking-widest font-bold">Sold Out</span>
                     </div>
                   )}
                </div>
                <div className="flex-grow flex flex-col items-center text-center">
                  <h3 className="font-serif text-lg text-gray-900 group-hover:text-amber-700 transition-colors mb-1">
                    {product.name}
                  </h3>
                  <span className="text-xs text-gray-400 uppercase tracking-wider mb-2">{product.category}</span>
                  <p className="text-gray-600 font-medium">₦{product.price.toLocaleString()}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-500 text-lg">No products found in this category.</p>
              <button onClick={() => setSearchParams({})} className="mt-4 text-amber-600 underline hover:text-amber-800">Clear filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;