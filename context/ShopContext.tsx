import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderStatus, Variant } from '../types';
import { INITIAL_PRODUCTS } from '../constants';
import { db } from '../services/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  runTransaction
} from 'firebase/firestore';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  addToCart: (product: Product, variant?: Variant) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  placeOrder: (details: { userId: string; name: string; email: string; address: string; paymentId: string }) => Promise<Order>;
  getUserOrders: (userId: string) => Order[];
  getAllOrders: () => Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  lastOrder: Order | null;
  loading: boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Helper to sanitize Firestore data
const sanitizeData = (data: any, seen = new WeakSet()): any => {
  if (data === null || typeof data !== 'object') return data;
  if (seen.has(data)) return '[Circular]';
  seen.add(data);
  if (Array.isArray(data)) return data.map(item => sanitizeData(item, seen));
  if (data && typeof data.toMillis === 'function') {
    return new Date(data.toMillis()).toISOString();
  }
  try {
    if (data.firestore && data.path) return data.path;
  } catch (e) { /* ignore */ }
  const sanitized: any = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      sanitized[key] = sanitizeData(data[key], seen);
    }
  }
  return sanitized;
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Products from Firestore
  useEffect(() => {
    // Safety check: if db failed to init in services/firebase.ts
    if (!db) {
      console.warn("Firestore not initialized. Using offline fallback.");
      setProducts(INITIAL_PRODUCTS);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productsData = snapshot.docs.map(doc => {
        const rawData = doc.data();
        const sanitized = sanitizeData(rawData);
        return {
          id: doc.id,
          ...sanitized
        };
      }) as Product[];
      
      if (productsData.length === 0) {
        setProducts(INITIAL_PRODUCTS);
      } else {
        setProducts(productsData);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      if (products.length === 0) setProducts(INITIAL_PRODUCTS);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load Cart and Orders from LocalStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('jo_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
      
      const savedOrders = localStorage.getItem('jo_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch (e) {
      console.error("Failed to parse localStorage data", e);
      setCart([]);
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    try {
      const cleanCart = sanitizeData(cart);
      localStorage.setItem('jo_cart', JSON.stringify(cleanCart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      const cleanOrders = sanitizeData(orders);
      localStorage.setItem('jo_orders', JSON.stringify(cleanOrders));
    } catch (e) {
      console.error("Failed to save orders to localStorage", e);
    }
  }, [orders]);

  const addToCart = (product: Product, variant?: Variant) => {
    const cartItemId = variant ? `${product.id}-${variant.id}` : product.id;

    setCart(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        const availableStock = variant ? variant.stock : product.stock;
        if (existing.quantity >= availableStock) {
           return prev; 
        }
        return prev.map(item => 
          item.cartItemId === cartItemId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      const sanitizedProduct = sanitizeData(product);
      return [...prev, { 
        ...sanitizedProduct, 
        cartItemId,
        quantity: 1,
        selectedVariant: variant,
        price: variant ? variant.price : product.price 
      }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(cartItemId);
      return;
    }
    const item = cart.find(i => i.cartItemId === cartItemId);
    if (item) {
       const availableStock = item.selectedVariant ? item.selectedVariant.stock : item.stock;
       if (quantity > availableStock) return;
    }
    setCart(prev => prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Firestore Write Operations
  const addProduct = async (product: Product) => {
    if (!db) throw new Error("Database connection not available");
    try {
      const { id, ...data } = product;
      if (id) {
         await setDoc(doc(db, 'products', id), data);
      } else {
         await addDoc(collection(db, 'products'), data);
      }
    } catch (error) {
      console.error("Error adding product: ", error);
      throw error;
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    if (!db) throw new Error("Database connection not available");
    try {
      const { id, ...data } = updatedProduct;
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, data as any);
    } catch (error) {
       console.error("Error updating product: ", error);
       throw error;
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!db) throw new Error("Database connection not available");
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      console.error("Error deleting product: ", error);
      throw error;
    }
  };

  const placeOrder = async (details: { userId: string; name: string; email: string; address: string; paymentId: string }) => {
    if (!db) throw new Error("Database connection not available");
    
    const now = new Date().toISOString();
    const newOrderRef = doc(collection(db, 'orders'));
    const orderItems = sanitizeData(cart);

    const order: Order = {
      id: newOrderRef.id,
      userId: details.userId,
      items: orderItems,
      total: cartTotal,
      date: now,
      customerName: details.name,
      email: details.email,
      status: OrderStatus.Paid,
      shippingAddress: details.address,
      statusHistory: [
        { status: OrderStatus.Paid, timestamp: now }
      ],
      paymentId: details.paymentId
    };

    try {
      await runTransaction(db, async (transaction) => {
        const productReads = await Promise.all(cart.map(item => transaction.get(doc(db, 'products', item.id))));
        
        for (let i = 0; i < cart.length; i++) {
          const item = cart[i];
          const productDoc = productReads[i];
          
          if (!productDoc.exists()) {
             throw new Error(`Product "${item.name}" is no longer available.`);
          }
          
          const product = productDoc.data() as Product;
          
          if (item.selectedVariant) {
            const variant = product.variants?.find(v => v.id === item.selectedVariant!.id);
            if (!variant) throw new Error(`Variant "${item.selectedVariant.name}" of "${item.name}" is no longer available.`);
            if (variant.stock < item.quantity) {
              throw new Error(`Insufficient stock for "${item.name}" - ${variant.name}. Available: ${variant.stock}`);
            }
          } else {
            if (product.stock < item.quantity) {
              throw new Error(`Insufficient stock for "${item.name}". Available: ${product.stock}`);
            }
          }
        }

        transaction.set(newOrderRef, order);

        for (let i = 0; i < cart.length; i++) {
           const item = cart[i];
           const productDoc = productReads[i];
           const product = productDoc.data() as Product;
           const productRef = doc(db, 'products', item.id);

           if (item.selectedVariant) {
             const newVariants = product.variants!.map(v => 
               v.id === item.selectedVariant!.id ? { ...v, stock: v.stock - item.quantity } : v
             );
             transaction.update(productRef, { variants: newVariants });
           } else {
             transaction.update(productRef, { stock: product.stock - item.quantity });
           }
        }
      });

      setOrders(prev => [order, ...prev]);
      setLastOrder(order);
      clearCart();
      return order;

    } catch (error) {
      console.error("Order processing failed: ", error);
      throw error;
    }
  };

  const getUserOrders = (userId: string) => {
    return orders.filter(order => order.userId === userId);
  };

  const getAllOrders = () => {
    return orders;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { 
          ...o, 
          status,
          statusHistory: [...(o.statusHistory || []), { status, timestamp: new Date().toISOString() }]
        };
      }
      return o;
    }));
  };

  return (
    <ShopContext.Provider value={{
      products, cart, orders, addToCart, removeFromCart, updateQuantity, clearCart, 
      cartTotal, cartCount, addProduct, updateProduct, deleteProduct, placeOrder, 
      getUserOrders, getAllOrders, updateOrderStatus, lastOrder, loading
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};