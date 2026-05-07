import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Service-role client. Bypasses RLS. Server-only — never import from client code.
// We pin the underlying fetch to `cache: "no-store"` so Next.js never caches
// supabase-js responses; admin edits hit the live storefront immediately.
export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: {
    fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
  },
});
