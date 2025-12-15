import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Admin from './pages/Admin';
import InfoPage from './pages/InfoPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ShopProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/success" element={<Success />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account" element={<Account />} />
              
              {/* Info Pages */}
              <Route path="/shipping" element={<InfoPage title="Shipping & Returns" />} />
              <Route path="/size-guide" element={<InfoPage title="Size Guide" />} />
              <Route path="/contact" element={<InfoPage title="Contact Us" />} />
            </Routes>
          </Layout>
        </Router>
      </ShopProvider>
    </AuthProvider>
  );
};

export default App;
