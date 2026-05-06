import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
  adminToken,
  checkCredentials,
  isAdminCookieValid,
} from "@/lib/admin/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sign in · Eloria Admin" };

async function login(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  if (!(await checkCredentials(email, password))) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);
  }
  const token = await adminToken();
  if (!token) {
    redirect("/admin/login?error=config");
  }
  cookies().set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string };
}) {
  const existing = cookies().get(ADMIN_COOKIE)?.value;
  if (await isAdminCookieValid(existing)) {
    redirect(searchParams.next ?? "/admin");
  }

  const error = searchParams.error;
  const errorMessage =
    error === "config"
      ? "ADMIN_EMAIL / ADMIN_PASSWORD env vars are not set on the server."
      : error
      ? "Wrong email or password."
      : null;

  return (
    <main className="grid min-h-screen place-items-center bg-cream px-5">
      <form
        action={login}
        className="w-full max-w-sm rounded-2xl border border-orange-dark/15 bg-pearl p-8 shadow-sm"
      >
        <h1 className="text-2xl font-extrabold text-ink">Eloria admin</h1>
        <p className="mt-1 text-sm text-ink/70">Sign in to manage your store.</p>

        <input type="hidden" name="next" value={searchParams.next ?? "/admin"} />

        <label className="mt-6 block text-[12px] font-bold uppercase tracking-wider text-ink/70">
          Email
        </label>
        <input
          type="email"
          name="email"
          autoFocus
          required
          autoComplete="email"
          className="mt-2 w-full rounded-lg border border-orange-dark/20 bg-cream px-4 py-3 text-ink outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/30"
        />

        <label className="mt-4 block text-[12px] font-bold uppercase tracking-wider text-ink/70">
          Password
        </label>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="mt-2 w-full rounded-lg border border-orange-dark/20 bg-cream px-4 py-3 text-ink outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/30"
        />

        {errorMessage && (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-orange px-6 py-3 text-[13px] font-extrabold uppercase tracking-wider text-pearl transition-colors hover:bg-orange-dark"
          style={{ color: "#FFFFFF", letterSpacing: "0.08em" }}
        >
          <span style={{ color: "#FFFFFF" }}>Sign in</span>
        </button>
      </form>
    </main>
  );
}
