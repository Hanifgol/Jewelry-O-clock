export enum Category {
  Rings = 'Rings',
  Necklaces = 'Necklaces',
  Bracelets = 'Bracelets',
  Earrings = 'Earrings',
  Watches = 'Watches',
  Sets = 'Sets'
}

export interface Variant {
  id: string;
  name: string; // e.g. "Size 7 - Gold"
  price: number;
  stock: number;
  options: { [key: string]: string }; // e.g. { "Size": "7", "Material": "Gold" }
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: Category;
  image: string;
  stock: number; // Fallback if no variants
  variants?: Variant[];
}

export interface CartItem extends Product {
  cartItemId: string; // Unique ID for the line item (productID + variantID)
  quantity: number;
  selectedVariant?: Variant;
}

export enum OrderStatus {
  PendingPayment = 'Pending Payment',
  Paid = 'Paid',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}

export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  date: string;
  customerName: string;
  email: string;
  status: OrderStatus;
  shippingAddress: string;
  statusHistory: OrderStatusHistory[];
  paymentId?: string;
}