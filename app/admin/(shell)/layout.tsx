import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE } from "@/lib/admin/auth";
import Logo from "@/components/admin/Logo";
import {
  IconDashboard,
  IconBox,
  IconCart,
  IconTag,
  IconStore,
  IconLogout,
  IconExternal,
} from "@/components/admin/icons";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Eloria" };

async function logout() {
  "use server";
  cookies().delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

const NAV: { href: string; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { href: "/admin", label: "Dashboard", Icon: IconDashboard },
  { href: "/admin/products", label: "Products", Icon: IconBox },
  { href: "/admin/orders", label: "Orders", Icon: IconCart },
  { href: "/admin/categories", label: "Categories", Icon: IconTag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <header className="sticky top-0 z-30 border-b border-orange-dark/10 bg-pearl/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3.5 md:px-8">
          <Link href="/admin" className="flex items-center gap-3">
            <Logo size={32} />
            <span className="hidden rounded-full border border-orange-dark/15 bg-orange/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-orange-dark sm:inline">
              Admin
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener"
              className="hidden items-center gap-1.5 rounded-full border border-orange-dark/20 bg-cream px-3.5 py-2 text-[12px] font-bold text-ink hover:border-orange-dark hover:bg-orange/5 md:inline-flex"
            >
              <IconStore size={14} />
              View store
              <IconExternal size={12} />
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full border border-orange-dark/20 bg-cream px-3.5 py-2 text-[12px] font-bold text-ink hover:border-red-300 hover:bg-red-50 hover:text-red-700"
              >
                <IconLogout size={14} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 pb-24 pt-6 md:px-8 md:pb-8 md:pt-8">
        <aside className="hidden w-60 flex-shrink-0 md:block">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
            Manage
          </p>
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-bold text-ink/75 transition-colors hover:bg-orange/8 hover:text-orange-dark"
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-orange/8 text-orange-dark transition-colors group-hover:bg-orange group-hover:text-pearl">
                  <item.Icon size={15} />
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-10 rounded-2xl border border-orange-dark/15 bg-pearl p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink/60">
              Need help?
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-ink/70">
              Most edits sync to the live store within seconds. Stuck on something? Reach out.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 border-t border-orange-dark/15 bg-pearl/95 backdrop-blur md:hidden">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold text-ink/65 hover:text-orange-dark"
          >
            <item.Icon size={18} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
