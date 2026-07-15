# Meta Pixel & Conversions API — Setup

Internal reference for the Eloria (eloria.si) Meta tracking. Covers the base
pixel, the four standard e-commerce events, the server-side Conversions API
(CAPI) Purchase, and browser/server deduplication.

## Architecture at a glance

| Event | Where it fires | Source of truth |
|-------|----------------|-----------------|
| `PageView` | Base pixel, every page (`app/layout.tsx`) | — |
| `ViewContent` | Product page (`components/product/ProductInfo.tsx`) | product price/id |
| `AddToCart` | After a successful add (product page + `AddToCartButton` / `BuyNowButton`) | cart line |
| `InitiateCheckout` | Just before the Stripe redirect (`app/blagajna/page.tsx`) | cart total |
| `Purchase` (browser) | Success page, only when Stripe reports `paid` (`app/narocilo/uspeh/PurchaseTracker.tsx`) | Stripe `amount_total` |
| `Purchase` (server / CAPI) | Stripe webhook after verified payment (`app/api/stripe/webhook/route.ts` → `lib/meta-capi.ts`) | Stripe `amount_total` |

- Client helper: `lib/meta-pixel.ts` (typed, SSR-safe `window.fbq` wrapper).
- Server helper: `lib/meta-capi.ts` (`import "server-only"` — never in the client bundle).
- `content_ids` are the **public product id** across every event (checkout stores
  `public_id` in the Stripe line-item metadata so browser + server agree).
- All monetary values are numeric decimals in **EUR**.

## Required environment variables

Add these to `.env.local` (and to the hosting env, e.g. Vercel):

```bash
# Public pixel id — safe in the browser. Has a hard-coded fallback, so optional.
NEXT_PUBLIC_META_PIXEL_ID=887907974366896

# Conversions API access token — SECRET, server-only. Enables the server-side
# Purchase event. Without it, browser events still fire; only CAPI is skipped.
META_CONVERSIONS_API_TOKEN=

# Optional. While testing, paste the Test Events code so server events appear
# in Events Manager → Test Events. MUST be removed before going live.
META_TEST_EVENT_CODE=

# Public. Renders <meta name="facebook-domain-verification" content="..."> in
# <head>. Only rendered when set.
NEXT_PUBLIC_META_DOMAIN_VERIFICATION=
```

`NEXT_PUBLIC_*` values are inlined into the client bundle by Next.js — only put
public values there. The CAPI token is **not** `NEXT_PUBLIC_` and is only read in
`lib/meta-capi.ts`, which is marked `server-only`.

## Run the Supabase migration (CAPI idempotency)

The server Purchase is deduplicated in the database via `orders.meta_purchase_sent_at`.

1. Open the Supabase dashboard → **SQL editor**.
2. Paste and run the contents of `supabase/migrations/20260708_meta_capi.sql`:
   ```sql
   alter table orders
     add column if not exists meta_purchase_sent_at timestamptz;
   ```
3. Done. The webhook atomically claims this column before sending, so a retried
   or raced webhook can never send a second server Purchase.

> If the migration hasn't been run yet, the code degrades gracefully: it falls
> back to `event_id` deduplication (Meta still collapses duplicates), so no
> double conversion occurs — but run the migration to make the DB claim active.

## Generate the Meta CAPI access token

1. **Events Manager** → select the Eloria pixel (`887907974366896`).
2. **Settings** → **Conversions API** → **Generate access token**.
3. Copy the token into `META_CONVERSIONS_API_TOKEN` in `.env.local` / hosting env.
4. Redeploy so the server picks it up.

Treat this token like a password — it is server-only and must never be committed
or exposed to the browser.

## Verify the domain (eloria.si)

1. **Events Manager** → **Settings** (Business/Brand safety → **Domains**).
2. Add `eloria.si`.
3. Choose **Meta-tag verification** and copy the `content` value.
4. Put it in `NEXT_PUBLIC_META_DOMAIN_VERIFICATION` and redeploy.
5. Back in Events Manager, click **Verify**. Confirm the tag is live:
   ```bash
   curl -s https://www.eloria.si | grep facebook-domain-verification
   ```
   Expected:
   ```html
   <meta name="facebook-domain-verification" content="..." />
   ```

## Test the events (Events Manager → Test Events)

Set `META_TEST_EVENT_CODE` first, open **Events Manager → your pixel → Test
Events**, and install the **Meta Pixel Helper** Chrome extension for the browser
side.

1. **ViewContent** — open any `/trgovina/<product>` page → one `ViewContent`
   with the product id + price. (Guarded against React Strict Mode double-fire.)
2. **AddToCart** — click **Dodaj v košarico** (or **Kupi zdaj**) → one
   `AddToCart` with `num_items`.
3. **InitiateCheckout** — on `/blagajna`, submit the form → one
   `InitiateCheckout` with the full cart total and all `content_ids`.
4. **Purchase** — complete a Stripe **test** payment and land on
   `/narocilo/uspeh`:
   - Browser: one `Purchase` (via Pixel Helper), value = amount paid.
   - Server: one `Purchase` in Test Events (requires `META_CONVERSIONS_API_TOKEN`).

## How browser/server deduplication works

- Both the browser Purchase and the server (CAPI) Purchase send the **same
  `event_id` = the Stripe Checkout Session id** (`cs_...`).
- Meta collapses the two into **one** conversion by matching `event_name` +
  `event_id`.
- Extra safeguards so it can't double-count:
  - **Browser refresh:** a `sessionStorage` guard + the shared `event_id`.
  - **Webhook retry / race:** the webhook returns early if an order already
    exists for the session, **and** the CAPI send is claimed atomically in the
    DB (`meta_purchase_sent_at` flips `NULL → now()`; only the winner sends).
- The Purchase **value is always Stripe's `amount_total`** (the real final
  amount charged, after discounts) — never the client cart.

## Before going live

- **Remove `META_TEST_EVENT_CODE`** from `.env.local` and every hosting
  environment (Vercel → Project → Settings → Environment Variables → delete it),
  then redeploy. While it's set, real Purchases are routed to Test Events and may
  not count as live conversions.
- Confirm `META_CONVERSIONS_API_TOKEN` and (optionally)
  `NEXT_PUBLIC_META_DOMAIN_VERIFICATION` are set in production.
- Confirm the Supabase migration has been run in production.
- Verify a real (non-test) order shows a single deduplicated Purchase in
  Events Manager.
