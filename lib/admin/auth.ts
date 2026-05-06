// Tiny admin auth: ADMIN_EMAIL + ADMIN_PASSWORD env vars.
// Cookie value is SHA-256 of (email + password) — if either env var changes,
// all sessions invalidate automatically. Web Crypto API so it works in both
// edge (middleware) and node runtimes.

const COOKIE_NAME = "eloria_admin";
const TWO_WEEKS_SECONDS = 60 * 60 * 24 * 14;

export const ADMIN_COOKIE = COOKIE_NAME;
export const ADMIN_COOKIE_MAX_AGE = TWO_WEEKS_SECONDS;

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function adminToken(): Promise<string | null> {
  const email = process.env.ADMIN_EMAIL;
  const pw = process.env.ADMIN_PASSWORD;
  if (!email || !pw) return null;
  return sha256(`eloria-admin:${email}:${pw}`);
}

function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function isAdminCookieValid(
  cookieValue: string | undefined | null,
): Promise<boolean> {
  if (!cookieValue) return false;
  const expected = await adminToken();
  if (!expected) return false;
  return timingSafeEqualString(cookieValue, expected);
}

export async function checkCredentials(
  email: string,
  password: string,
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPw = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPw) return false;
  // Email is case-insensitive; password is exact.
  return (
    email.trim().toLowerCase() === adminEmail.trim().toLowerCase() &&
    timingSafeEqualString(password, adminPw)
  );
}
