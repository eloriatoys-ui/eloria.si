import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, isAdminCookieValid } from "@/lib/admin/auth";

export const config = {
  matcher: ["/admin/:path*"],
};

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Login page is public.
  if (path === "/admin/login") return NextResponse.next();

  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  const ok = await isAdminCookieValid(cookie);
  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
