# Hair Secrets Store

A premium, production-ready e-commerce website for **Hair Secrets Store**, a luxury Raw Human Hair brand.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Supabase**, with **DHL Express** shipping/tracking and **DPO Pay** (Mobile Money + cards) integrations.

Brand color `#AD918F` with cream, white, nude, and dark espresso accents. Display type: Cormorant Garamond; UI type: Jost.

---

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your keys
npm run dev                  # http://localhost:3000
```

Build for production:

```bash
npm run build && npm start
```

---

## Storefront pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, collections, bestsellers, story, testimonials, newsletter |
| `/shop` | Shop with texture/origin filters and sorting |
| `/product/[slug]` | Product details — variant (length) picker, add to cart/wishlist |
| `/collections` + `/collections/[slug]` | Collections index and detail |
| `/about` | Brand story, ethical sourcing, hair-care guide |
| `/cart` | Shopping bag with free-shipping progress |
| `/checkout` | Contact, shipping, and DPO Pay payment (Mobile Money / card) |
| `/wishlist` | Saved products (persisted locally) |
| `/track` | DHL order tracking timeline |
| `/contact` | Contact form + wholesale enquiries |
| `/account` | Customer auth + orders/wishlist/addresses/profile |
| `/order/[ref]` | Order confirmation with progress steps |

## Admin dashboard (`/admin`)

Auth-gated control panel: **Dashboard** (analytics), **Products**, **Inventory**,
**Orders**, **Customers**, **Discounts**, **Content**, **Analytics**, **Settings**.

---

## Architecture

```
src/
  app/                 # routes (storefront + admin + api)
    api/checkout       # create order + initiate DPO payment
    api/track          # look up order + DHL tracking
    api/dpo/callback   # verify DPO payment on return
  components/          # layout, product, admin, ui
  lib/
    data.ts            # demo catalog (swap for Supabase queries)
    store.ts           # cart + wishlist (zustand, persisted)
    supabase/          # browser + server + service clients
    integrations/
      dhl.ts           # DHL Express rates + tracking
      dpo.ts           # DPO Pay token/verify/mobile-money
supabase/schema.sql    # full database schema + RLS
```

## Connecting the backends

The app **auto-detects** whether Supabase/DHL/DPO are configured. With no keys it
runs in **demo mode** on built-in data so every page works immediately; the moment
you add keys it switches to the live backend — no code changes required. Every
live query is wrapped so a missing/empty table falls back to demo data rather than
crashing.

1. **Supabase** — create a project and run `supabase/schema.sql` in the SQL editor.
   Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
   `SUPABASE_SERVICE_ROLE_KEY`. Then seed the catalog:
   ```bash
   npm run seed        # inserts collections, products & variants
   ```
   - Catalog reads flow through `src/lib/repository.ts` (live → demo fallback).
   - Auth is live automatically: the **Account** page uses `supabase.auth`
     (sign-up/in/out + real order history).
   - The **admin** area is protected by `src/proxy.ts` (Next 16 middleware),
     which requires a signed-in user whose `profiles.is_admin = true`.

   **Make yourself an admin:** sign up on `/account`, then in Supabase run
   ```sql
   update profiles set is_admin = true where id = (
     select id from auth.users where email = 'you@example.com'
   );
   ```
2. **DHL** — set `DHL_API_KEY`, `DHL_API_SECRET`, `DHL_ACCOUNT_NUMBER`.
   `src/app/api/track` and `lib/integrations/dhl.ts` then return live tracking
   (flat-rate fallback until then).
3. **DPO Pay** — set `DPO_COMPANY_TOKEN`. Checkout (`src/app/api/checkout`) then
   creates a real transaction and redirects to DPO's hosted page;
   `src/app/api/dpo/callback` verifies payment and marks the order paid. Point
   your DPO dashboard callback at `https://YOUR-DOMAIN/api/dpo/callback`.

## Notes on media

Product imagery uses elegant tonal gradient placeholders (`ProductImage`) so the
site is fully runnable without assets. Upload real photos to Supabase Storage and
swap `ProductImage` for a Next `<Image>` — the data model already carries an
`images[]` field per product.

## SEO

Per-page metadata, Open Graph tags, `sitemap.xml`, and `robots.txt` are all
generated. Update `NEXT_PUBLIC_SITE_URL` for your domain.
