import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, LogOut, Package, LayoutDashboard } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { Category } from '../types';

const Header: React.FC = () => {
  const { cartCount } = useShop();
  const { user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path ? 'text-amber-600' : 'text-gray-600 hover:text-amber-600';

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Mobile Menu Button & Logo Wrapper */}
          <div className="flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden text-gray-600 p-2 -ml-2 hover:text-gray-900 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center ml-2 md:ml-0">
              <Link to="/" className="font-serif text-xl md:text-2xl font-bold tracking-wider text-gray-900">
                JEWELRY O'CLOCK
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className={`uppercase text-sm tracking-widest transition-colors ${isActive('/')}`}>Home</Link>
            <Link to="/shop" className={`uppercase text-sm tracking-widest transition-colors ${isActive('/shop')}`}>All</Link>
            {Object.keys(Category).map((cat) => (
               <Link key={cat} to={`/shop?category=${cat}`} className={`uppercase text-sm tracking-widest transition-colors ${isActive(`/shop?category=${cat}`)}`}>
                 {cat}
               </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-2 md:space-x-4">
             {/* User Dropdown */}
             <div className="relative hidden md:block">
               {user ? (
                 <button 
                   onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                   className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 focus:outline-none p-2"
                 >
                   <User size={20} />
                   <span className="text-sm font-medium ml-2">{user.name.split(' ')[0]} {isAdmin && '(Admin)'}</span>
                 </button>
               ) : (
                 <Link to="/login" className="text-sm font-bold uppercase tracking-wider text-gray-900 hover:text-amber-600 transition-colors p-2">
                   Login
                 </Link>
               )}

               {isUserMenuOpen && user && (
                 <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 shadow-lg py-1 z-50">
                    {/* Admin Links */}
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <LayoutDashboard size={16} className="mr-2" /> Admin Dashboard
                      </Link>
                    )}

                    {/* Customer Links */}
                    {!isAdmin && (
                      <Link 
                        to="/account" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <Package size={16} className="mr-2" /> My Orders
                      </Link>
                    )}
                    
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" /> Logout
                    </button>
                 </div>
               )}
             </div>

            {/* Cart - Visible to all except admin, prominently displayed */}
            {!isAdmin && (
              <Link to="/cart" className="relative text-gray-600 hover:text-amber-600 transition-colors p-2 group">
                <ShoppingBag size={24} className="group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-amber-600 rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 h-screen absolute w-full z-40">
          <div className="px-4 pt-4 pb-3 space-y-1">
             <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-lg font-medium text-gray-900 border-b border-gray-50">Home</Link>
             <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-lg font-medium text-gray-900 border-b border-gray-50">Shop All</Link>
             {Object.keys(Category).map((cat) => (
               <Link key={cat} to={`/shop?category=${cat}`} onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-lg font-medium text-gray-600 hover:text-amber-600 border-b border-gray-50">
                 {cat}
               </Link>
            ))}
            <div className="mt-6 pt-2 px-2">
              {user ? (
                <>
                  <div className="flex items-center mb-4 px-2">
                    <div className="bg-amber-50 p-2 rounded-full mr-3">
                      <User size={20} className="text-amber-700" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  {isAdmin ? (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 bg-gray-50 rounded mb-2">Admin Dashboard</Link>
                  ) : (
                    <Link to="/account" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 bg-gray-50 rounded mb-2">My Orders</Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-3 text-base font-medium text-red-500 hover:text-red-700">Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center px-3 py-4 text-base font-medium bg-gray-900 text-white rounded hover:bg-amber-600 transition-colors">Login / Sign Up</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-gray-900">JEWELRY O'CLOCK</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Crafting moments of elegance since 2024. Ethical sourcing, exquisite design, and timeless beauty.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900">Collections</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/shop?category=Watches" className="hover:text-amber-600">Watches</Link></li>
              <li><Link to="/shop?category=Sets" className="hover:text-amber-600">Jewelry Sets</Link></li>
              <li><Link to="/shop?category=Rings" className="hover:text-amber-600">Rings</Link></li>
              <li><Link to="/shop?category=Necklaces" className="hover:text-amber-600">Necklaces</Link></li>
              <li><Link to="/shop?category=Earrings" className="hover:text-amber-600">Earrings</Link></li>
              <li><Link to="/shop?category=Bracelets" className="hover:text-amber-600">Bracelets</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900">Customer Care</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/shipping" className="hover:text-amber-600">Shipping & Returns</Link></li>
              <li><Link to="/size-guide" className="hover:text-amber-600">Size Guide</Link></li>
              <li><Link to="/contact" className="hover:text-amber-600">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">&copy; 2025 Jewelry O'clock. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;