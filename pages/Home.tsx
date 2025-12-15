import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Category } from '../types';

const Home: React.FC = () => {
  const { products } = useShop();
  
  // Get 3 random products for featured section
  const featuredProducts = products.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[500px] bg-gray-900 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1920&auto=format&fit=crop" 
            alt="Hero Jewelry" 
            className="w-full h-full object-cover opacity-70 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-white font-bold mb-6 tracking-tight drop-shadow-lg leading-tight">
            Luxury Redefined
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-10 max-w-lg mx-auto font-light tracking-wide leading-relaxed">
            Exquisite pearls, timeless watches, and radiant gemstones for the modern connoisseur.
          </p>
          <Link 
            to="/shop" 
            className="inline-block bg-white text-gray-900 px-8 py-4 uppercase tracking-widest text-xs sm:text-sm font-bold hover:bg-amber-600 hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Explore Collections
          </Link>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
           <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-4">Curated Collections</h2>
           <div className="w-16 h-0.5 bg-amber-600 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['Watches', 'Sets', 'Rings'].map((cat, idx) => (
            <Link key={cat} to={`/shop?category=${cat}`} className="group relative h-80 md:h-96 overflow-hidden block rounded-lg md:rounded-none">
              <img 
                src={
                  cat === 'Watches' ? "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800" :
                  cat === 'Sets' ? "https://images.unsplash.com/photo-1620656199806-a24443912190?q=80&w=800" :
                  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800"
                }
                alt={cat} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-serif text-3xl tracking-widest border-b-2 border-transparent group-hover:border-white transition-all pb-1 duration-300">
                  {cat}
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
           <Link to="/shop" className="text-amber-700 hover:text-amber-900 font-bold uppercase tracking-widest text-sm inline-flex items-center py-2">
             View All Categories <ArrowRight size={16} className="ml-2" />
           </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-end mb-12">
             <div>
                <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-2">Editor's Picks</h2>
                <p className="text-gray-500 font-light">Hand-selected pieces for you.</p>
             </div>
             <Link to="/shop" className="hidden md:flex items-center text-amber-700 hover:text-amber-900 transition-colors uppercase text-xs font-bold tracking-widest">
                View All <ArrowRight size={16} className="ml-2" />
             </Link>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {featuredProducts.map(product => (
               <Link key={product.id} to={`/product/${product.id}`} className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                 <div className="relative overflow-hidden aspect-[3/4]">
                   <img 
                     src={product.image} 
                     alt={product.name} 
                     className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                   />
                   {product.stock < 5 && (
                     <span className="absolute top-4 left-4 bg-amber-600 text-white text-[10px] uppercase font-bold px-2 py-1 tracking-widest">
                       Low Stock
                     </span>
                   )}
                 </div>
                 <div className="p-6 text-center md:text-left">
                    <span className="text-xs text-gray-400 uppercase tracking-widest block mb-1">{product.category}</span>
                    <h3 className="font-serif text-lg text-gray-900 group-hover:text-amber-700 transition-colors mb-2">{product.name}</h3>
                    <p className="text-gray-900 font-medium">₦{product.price.toLocaleString()}</p>
                 </div>
               </Link>
             ))}
           </div>
           
           <div className="mt-12 text-center md:hidden">
              <Link to="/shop" className="inline-flex items-center bg-white px-6 py-3 border border-gray-200 shadow-sm text-gray-900 hover:text-amber-900 transition-colors uppercase text-xs font-bold tracking-widest">
                View All Products <ArrowRight size={16} className="ml-2" />
             </Link>
           </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-20 border-t border-gray-100">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-amber-600 mb-4 flex justify-center"><span className="text-3xl">✦</span></div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Authentic Luxury</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Guaranteed authenticity on all watches and fine jewelry.</p>
            </div>
            <div className="p-6">
              <div className="text-amber-600 mb-4 flex justify-center"><span className="text-3xl">✦</span></div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Global Sourcing</h4>
              <p className="text-gray-500 text-sm leading-relaxed">We travel the world to bring you unique designs.</p>
            </div>
            <div className="p-6">
              <div className="text-amber-600 mb-4 flex justify-center"><span className="text-3xl">✦</span></div>
              <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Secure Shipping</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Insured, fast, and discreet shipping on all orders.</p>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;