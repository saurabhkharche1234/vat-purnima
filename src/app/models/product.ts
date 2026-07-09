export type Category = 'dresses' | 'tshirts' | 'pants';

export interface ProductVariant {
  sku: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL';
  color: string;
  price: number;
  inventory: number;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: Category;
  description: string;
  price: number;
  currency: string;
  variants: ProductVariant[];
  images: string[];
  attributes: Record<string, string>;
  rating: number;
  reviewsCount: number;
  badge?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantSku: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Address {
  id: string;
  fullName: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderSummary {
  id: string;
  date: string;
  total: number;
  status: string;
  items: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  wishlist: string[];
  orders: OrderSummary[];
}
