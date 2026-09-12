-- Hair Secrets Store — Supabase schema
-- Run in the Supabase SQL editor. Enables auth, products, orders, and RLS.

-- Extensions
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Profiles (extends auth.users)
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Collections
-- ---------------------------------------------------------------------------
create table if not exists collections (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  tagline text,
  description text,
  tone text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  texture text not null,
  origin text not null,
  collection_id uuid references collections(id) on delete set null,
  short_description text,
  description text,
  features text[] default '{}',
  images text[] default '{}',
  tone text,
  rating numeric(2,1) default 5.0,
  review_count int default 0,
  bestseller boolean default false,
  is_new boolean default false,
  created_at timestamptz not null default now()
);

-- Product variants (length / price / stock)
create table if not exists product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  length int not null,
  price int not null,          -- US cents
  compare_at int,              -- US cents
  stock int not null default 0,
  sku text unique not null
);

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type order_status as enum
      ('pending','paid','processing','shipped','in_transit','delivered','cancelled');
  end if;
end $$;

create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  reference text unique not null,
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  customer_name text,
  status order_status not null default 'pending',
  subtotal int not null,       -- US cents
  shipping int not null default 0,
  total int not null,
  currency text not null default 'USD',
  items jsonb not null,        -- snapshot of cart items
  shipping_address jsonb,
  payment_method text,         -- 'Mobile Money' | 'Card'
  dpo_trans_token text,
  tracking_number text,
  carrier text default 'DHL Express',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Wishlist
-- ---------------------------------------------------------------------------
create table if not exists wishlists (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- ---------------------------------------------------------------------------
-- Discounts
-- ---------------------------------------------------------------------------
create table if not exists discounts (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  type text not null,          -- 'percent' | 'fixed' | 'free_shipping'
  value int default 0,         -- percent (0-100) or US cents
  min_subtotal int default 0,
  active boolean default true,
  usage_count int default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Contact messages
-- ---------------------------------------------------------------------------
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text,
  subject text,
  body text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Newsletter subscribers
-- ---------------------------------------------------------------------------
create table if not exists subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  source text,                 -- 'popup' | 'footer' | 'homepage'
  consent boolean default true,
  created_at timestamptz not null default now()
);

-- Order-level discount (applied promo code)
alter table orders add column if not exists discount_code text;
alter table orders add column if not exists discount_amount int default 0;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table profiles enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table collections enable row level security;
alter table orders enable row level security;
alter table wishlists enable row level security;
alter table discounts enable row level security;

-- Public can read the catalog
drop policy if exists "public read products" on products;
create policy "public read products" on products for select using (true);
drop policy if exists "public read variants" on product_variants;
create policy "public read variants" on product_variants for select using (true);
drop policy if exists "public read collections" on collections;
create policy "public read collections" on collections for select using (true);
drop policy if exists "public read active discounts" on discounts;
create policy "public read active discounts" on discounts for select using (active);

-- Users manage their own data
drop policy if exists "own profile" on profiles;
create policy "own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "own orders read" on orders;
create policy "own orders read" on orders
  for select using (auth.uid() = user_id);
drop policy if exists "own wishlist" on wishlists;
create policy "own wishlist" on wishlists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Admins manage everything
drop policy if exists "admin all products" on products;
create policy "admin all products" on products
  for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));
drop policy if exists "admin all orders" on orders;
create policy "admin all orders" on orders
  for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

-- Auto-create a profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Subscribers: written by the server (service role) only; no public access.
alter table subscribers enable row level security;
drop policy if exists "admin read subscribers" on subscribers;
create policy "admin read subscribers" on subscribers
  for select using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

-- Seed the standing promo codes (idempotent).
insert into discounts (code, type, value, min_subtotal, active)
values
  ('WELCOME10', 'percent', 10, 0, true),
  ('LUXE20', 'percent', 20, 50000, true)
on conflict (code) do nothing;

-- Refresh the PostgREST schema cache so the API sees the new tables immediately
notify pgrst, 'reload schema';
