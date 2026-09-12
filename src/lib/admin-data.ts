// Demo data for the admin dashboard. Replace with Supabase queries in production.
import { products } from "./data";

export const adminStats = {
  revenue: 4875000, // US cents ($48,750)
  revenueChange: 12.4,
  orders: 342,
  ordersChange: 8.1,
  customers: 1289,
  customersChange: 15.2,
  conversion: 3.8,
  conversionChange: -0.4,
};

// Monthly revenue in US cents for the last 12 months
export const revenueSeries = [
  240000, 265000, 298000, 312000, 355000, 402000, 388000, 430000, 465000,
  489000, 512000, 548000,
];

export const monthLabels = [
  "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
];

export const topProducts = products.slice(0, 5).map((p, i) => ({
  name: p.name,
  slug: p.slug,
  sold: 48 - i * 8,
  revenue: (48 - i * 8) * p.variants[Math.min(3, p.variants.length - 1)].price,
  stock: p.variants.reduce((s, v) => s + v.stock, 0),
  tone: p.tone,
}));

export type AdminOrder = {
  ref: string;
  customer: string;
  email: string;
  date: string;
  status: "paid" | "processing" | "shipped" | "delivered" | "pending";
  total: number;
  payment: "Mobile Money" | "Card";
};

export const adminOrders: AdminOrder[] = [
  { ref: "HS-2608-PL10B", customer: "Nadia Kato", email: "nadia@mail.com", date: "24 Aug", status: "processing", total: 21500, payment: "Mobile Money" },
  { ref: "HS-2608-QW44C", customer: "Amara Obi", email: "amara@mail.com", date: "23 Aug", status: "shipped", total: 42500, payment: "Card" },
  { ref: "HS-2608-ZX18D", customer: "Tiffany Rose", email: "tiff@mail.com", date: "23 Aug", status: "paid", total: 18500, payment: "Card" },
  { ref: "HS-2608-MN73E", customer: "Grace Nakato", email: "grace@mail.com", date: "22 Aug", status: "delivered", total: 65000, payment: "Mobile Money" },
  { ref: "HS-2608-RT29F", customer: "Zainab Ali", email: "zainab@mail.com", date: "22 Aug", status: "pending", total: 22000, payment: "Card" },
  { ref: "HS-2608-VB56G", customer: "Lindiwe M.", email: "lindiwe@mail.com", date: "21 Aug", status: "delivered", total: 38000, payment: "Card" },
];

export type AdminCustomer = {
  name: string;
  email: string;
  orders: number;
  spent: number;
  country: string;
};

export const adminCustomers: AdminCustomer[] = [
  { name: "Grace Nakato", email: "grace@mail.com", orders: 8, spent: 412000, country: "Uganda" },
  { name: "Amara Obi", email: "amara@mail.com", orders: 6, spent: 298000, country: "Nigeria" },
  { name: "Tiffany Rose", email: "tiff@mail.com", orders: 5, spent: 245000, country: "USA" },
  { name: "Nadia Kato", email: "nadia@mail.com", orders: 4, spent: 186000, country: "Uganda" },
  { name: "Lindiwe M.", email: "lindiwe@mail.com", orders: 3, spent: 142000, country: "South Africa" },
];
