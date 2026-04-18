# Threadwise

AI-powered team knowledge base with threaded discussions on every doc.

## What was built

A full marketing site for Threadwise SaaS:

- **Hero** — bold headline + animated browser-style product mockup + trust-bar
- **Features grid** — 4 features (AI search, threaded discussions, integrations, permissions)
- **Pricing** — 3 tiers (Starter £9, Team £29, Enterprise £99 per seat/month) served from Supabase, checked out via Stripe Checkout
- **Comparison table** — feature matrix across tiers
- **Testimonials** — 3 customer quotes served from Supabase
- **FAQ** — 6 questions in accordion form (schema.org FAQPage JSON-LD)
- **Signup form** — stores leads in Supabase + fires Resend confirmation email
- **Stripe webhook** at `/api/stripe/webhook` — writes `orders` rows + sends order confirmation email on `checkout.session.completed`
- **Programmatic SEO** — sitemap.xml, robots.txt, per-page JSON-LD

## Stack

- Astro 6 (server output) + @astrojs/vercel
- Tailwind v4 via @tailwindcss/vite
- Supabase (Postgres + Anon key reads)
- Stripe (dynamic `price_data` Checkout sessions + webhook)
- Resend (transactional email, from `onboarding@resend.dev` until you verify a custom domain)
- Deployed on Vercel

## Local development

```bash
npm install
cp .env.example .env      # fill in values
npm run dev
```

## Environment variables

See `.env.example`. Required:

| Var | Purpose |
| --- | --- |
| `PUBLIC_SUPABASE_URL` | Supabase project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/publishable key |
| `STRIPE_SECRET_KEY` | Stripe server key |
| `PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key (optional, for client-side Stripe.js) |
| `STRIPE_WEBHOOK_SECRET` | From the Stripe webhook endpoint created post-deploy |
| `RESEND_API_KEY` | Resend API key for transactional mail |
| `PUBLIC_SITE_URL` | Production URL (e.g. `https://threadwise.vercel.app`) |

## Database schema (Supabase)

- `products` — pricing tiers
- `leads` — signup form submissions
- `orders` — written by Stripe webhook
- `testimonials` — carousel content
- `faqs` — FAQ accordion
- `content` — blog/article content (Harbor content hook)

## Next steps

- [ ] Connect a custom domain in Vercel
- [ ] Verify a Resend sending domain (currently using `onboarding@resend.dev`)
- [ ] Switch Stripe to live keys before taking real payments
- [ ] Add product screenshots / real customer logos
