import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Eloria" };

async function logout() {
  "use server";
  cookies().delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "🧸" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/categories", label: "Categories", icon: "🏷️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-orange-dark/15 bg-pearl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-xl font-extrabold text-ink">
              Eloria <span className="text-orange-dark">Admin</span>
            </Link>
            <Link
              href="/"
              className="hidden text-[12px] font-bold text-ink/60 hover:text-orange-dark md:inline"
            >
              ↗ View store
            </Link>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border border-orange-dark/25 bg-cream px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-ink hover:bg-orange-dark hover:text-pearl"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-5 py-6 md:px-8 md:py-8">
        <aside className="hidden w-56 flex-shrink-0 md:block">
          <nav className="sticky top-6 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-bold text-ink/80 hover:bg-orange/10 hover:text-orange-dark"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 border-t border-orange-dark/15 bg-pearl md:hidden">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-0.5 py-2 text-[10px] font-bold text-ink/70 hover:text-orange-dark"
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
