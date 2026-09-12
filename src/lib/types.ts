// Core domain types for Hair Secrets Store

export type HairTexture =
  | "Straight"
  | "Body Wave"
  | "Deep Wave"
  | "Curly"
  | "Kinky Curly"
  | "Water Wave";

export type HairOrigin = "Brazilian" | "Peruvian" | "Cambodian" | "Vietnamese" | "Indian";

export interface ProductVariant {
  id: string;
  /** e.g. length in inches */
  length: number;
  /** price in whole UGX */
  price: number;
  /** compare-at price in whole UGX (for showing discounts) */
  compareAt?: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** "hair" bundles have texture/origin/length; "accessory" items don't. */
  category?: "hair" | "accessory";
  texture?: HairTexture;
  origin?: HairOrigin;
  collection: string;
  shortDescription: string;
  description: string;
  features: string[];
  images: string[];
  /** hero gradient used as image placeholder */
  tone: string;
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  bestseller?: boolean;
  isNew?: boolean;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tone: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  /** 0 for accessories (no length) */
  length: number;
  texture?: HairTexture;
  price: number;
  tone: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  texture?: HairTexture;
  origin?: HairOrigin;
  price: number;
  tone: string;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "in_transit"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  reference: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  customerName: string;
  email: string;
  createdAt: string;
  trackingNumber?: string;
  carrier?: string;
}
