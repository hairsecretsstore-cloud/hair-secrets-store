# Deploying Hair Secrets Store — Vercel + Namecheap domain

You host the **app on Vercel** (free, built for Next.js) and keep the **domain at
Namecheap**, pointing Namecheap's DNS at Vercel. SSL is automatic and free.

---

## Part 1 — Push the code to GitHub

From the project folder (`hair-secrets-store/`):

```bash
git add -A
git commit -m "Hair Secrets Store — initial build"
```

Create an empty repo on github.com (e.g. `hair-secrets-store`), then:

```bash
git remote add origin https://github.com/YOUR-USERNAME/hair-secrets-store.git
git branch -M main
git push -u origin main
```

> `.env.local` is git-ignored, so your secrets never leave your machine.
> Only `.env.example` (the template) is committed.

---

## Part 2 — Import into Vercel

1. Go to [vercel.com](https://vercel.com) → sign up / log in with GitHub.
2. **Add New… → Project** → import `hair-secrets-store`.
3. Vercel auto-detects **Next.js** — leave the build settings as-is:
   - Framework: Next.js
   - Build command: `next build` (default)
   - Output: (managed automatically)
4. Before the first deploy, add your **Environment Variables** (Part 3).
5. Click **Deploy**. You'll get a live URL like `hair-secrets-store.vercel.app`.

> The app runs in **demo mode** even with no env vars, so the first deploy will
> succeed and every page will render. Add the keys below to switch on the real
> database, shipping, and payments.

---

## Part 3 — Environment variables (Vercel → Settings → Environment Variables)

Add these (from your `.env.example`). Set them for **Production** (and Preview):

| Key | Where to get it |
|-----|-----------------|
| `NEXT_PUBLIC_SITE_URL` | Your final domain, e.g. `https://hairsecretsstore.co` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (keep secret) |
| `DHL_API_ENV` | `test` while developing, `production` when live |
| `DHL_API_KEY` / `DHL_API_SECRET` / `DHL_ACCOUNT_NUMBER` | developer.dhl.com |
| `DPO_COMPANY_TOKEN` | Your DPO Pay account |
| `DPO_SERVICE_TYPE` | Your configured DPO service id |

After adding/changing env vars, **redeploy** (Vercel → Deployments → ⋯ → Redeploy).

---

## Part 4 — Connect your Namecheap domain

**In Vercel:**
1. Project → **Settings → Domains → Add**.
2. Enter your domain, e.g. `hairsecretsstore.co` (add `www.hairsecretsstore.co` too).
3. Vercel shows you the DNS records to create — usually:
   - `A` record → `76.76.21.21` (for the root/apex domain)
   - `CNAME` record → `cname.vercel-dns.com` (for `www`)
   - *(Vercel shows the exact current values — always use what it displays.)*

**In Namecheap:**
1. Dashboard → **Domain List → Manage** (your domain) → **Advanced DNS**.
2. Remove any existing parking/`A`/`CNAME` records that conflict.
3. Add the records Vercel gave you:
   - Type `A Record`, Host `@`, Value `76.76.21.21`
   - Type `CNAME Record`, Host `www`, Value `cname.vercel-dns.com`
4. Save. DNS usually propagates in minutes (can take up to a few hours).

Back in Vercel, the domain flips to **Valid / SSL issued** automatically. Done.

---

## Part 5 — Go-live checklist

- [ ] Supabase project created, `supabase/schema.sql` run in the SQL editor
- [ ] Catalog seeded: `npm run seed` (needs the Supabase env vars set locally)
- [ ] Signed up on `/account`, then set `profiles.is_admin = true` for your user
      (SQL in the README) so you can reach `/admin`
- [ ] Real product photos loaded to Supabase Storage (swap `ProductImage` for `<Image>`)
- [ ] DHL keys added (live rates/tracking via `app/api/track`)
- [ ] DPO keys added (live payments via `app/api/checkout` + `app/api/dpo/callback`)
- [ ] **DPO callback URL** set in your DPO dashboard to
      `https://YOUR-DOMAIN/api/dpo/callback`
- [ ] `NEXT_PUBLIC_SITE_URL` set to the real domain (fixes sitemap/OG/redirects)
- [ ] Test a full order end-to-end in DHL/DPO **test** mode first

---

## Updating the site later

Every `git push` to `main` triggers an automatic Vercel deploy. No manual upload —
no more manual `out/ → public_html` uploads — Vercel builds and deploys for you.

```bash
git add -A && git commit -m "your change" && git push
```
