import { STORE_NAME } from "@/lib/data";

const linkCols = [
  {
    title: "Shop",
    items: [
      { label: "All products", href: "/shop" },
      { label: "Clothing sets", href: "/shop?category=Clothing+sets+AMAREEN" },
      { label: "Dresses", href: "/shop?category=Dresses" },
      { label: "Accessories", href: "/shop?category=Accessories" },
      { label: "New arrivals", href: "/shop?category=New" },
      { label: "On sale", href: "/shop?onSale=1" },
    ],
  },
  {
    title: "Customer care",
    items: [
      { label: "Track your order", href: "#" },
      { label: "Shipping & delivery", href: "/#faq" },
      { label: "Returns & refunds", href: "/#faq" },
      { label: "Size guide", href: "/#faq" },
      { label: "FAQ", href: "/#faq" },
      { label: "Contact us", href: "mailto:hello@amareen.si" },
    ],
  },
  {
    title: "About Eloria",
    items: [
      { label: "Our story", href: "/about" },
      { label: "Sustainability", href: "/#why" },
      { label: "Reviews", href: "/#testimonials" },
      { label: "Press", href: "#" },
      { label: "Affiliates", href: "#" },
      { label: "Wholesale", href: "mailto:hello@amareen.si" },
    ],
  },
];

function SocialIcon({ name }: { name: "instagram" | "tiktok" | "whatsapp" | "facebook" | "youtube" }) {
  const stroke = "currentColor";
  switch (name) {
    case "instagram":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "tiktok":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 8.4a6.6 6.6 0 0 1-3.9-1.3v7.4a5.4 5.4 0 1 1-5.4-5.4c.3 0 .6 0 .9.1v2.7a2.7 2.7 0 1 0 1.8 2.6V2h2.7a3.9 3.9 0 0 0 3.9 3.9V8.4Z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.5 3.5A10 10 0 0 0 3.7 17.7L2 22l4.4-1.6a10 10 0 0 0 14.1-13Zm-8.5 16a8 8 0 0 1-4.1-1.1l-.3-.2-2.6 1 1-2.6-.2-.3a8 8 0 1 1 6.2 3.2Zm4.4-6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.6.1-.6.7-.8.9c-.1.1-.3.2-.5 0a6.5 6.5 0 0 1-1.9-1.2 7.2 7.2 0 0 1-1.3-1.6c-.1-.2 0-.4.1-.5l.3-.4.2-.4a.4.4 0 0 0 0-.4l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4a3 3 0 0 0-1 2.3c0 1.4 1 2.7 1.1 2.9.1.2 2 3.1 4.9 4.4a16 16 0 0 0 1.7.6 4 4 0 0 0 1.8.1c.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.5-.3Z" />
        </svg>
      );
    case "facebook":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 12a10 10 0 1 0-11.6 9.9V15h-2.5v-3h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 3h-2.3v6.9A10 10 0 0 0 22 12Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 0 0 .5 6.5C.1 8.4.1 12 .1 12s0 3.6.4 5.5a3 3 0 0 0 2.1 2.1c1.9.4 9.4.4 9.4.4s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1c.4-1.9.4-5.5.4-5.5s0-3.6-.4-5.5ZM9.6 15.5v-7L15.8 12l-6.2 3.5Z" />
        </svg>
      );
  }
}

const socials: { name: Parameters<typeof SocialIcon>[0]["name"]; href: string; label: string }[] = [
  { name: "instagram", href: "https://instagram.com/amareen.slovenija/", label: "Instagram" },
  { name: "facebook", href: "https://facebook.com/AMAREEN.Slovenija/", label: "Facebook" },
  { name: "tiktok", href: "https://tiktok.com/@amareen.slovenija", label: "TikTok" },
  { name: "youtube", href: "https://youtube.com/channel/UCBsIONfy3jEdtWNwY-340oA", label: "YouTube" },
];

const payments = ["Visa", "Mastercard", "Amex", "Apple Pay", "Google Pay", "PayPal"];

export default function Footer() {
  return (
    <footer className="bg-pearl text-ink">
      {/* Top — brand + links */}
      <div className="border-t border-orange-dark/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-12 md:px-8 md:py-16">
          {/* Brand column */}
          <div className="md:col-span-4">
            <a href="/" className="inline-flex items-center" aria-label={STORE_NAME}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/eloria.webp"
                alt={STORE_NAME}
                className="h-10 w-auto"
              />
            </a>
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-slate">
              Magical toys & organic kids&apos; clothes — built to be loved,
              hand-me-downed, and remembered.
            </p>

            {/* Contact info */}
            <ul className="mt-6 flex flex-col gap-2.5 text-[13px] text-ink/85">
              <li className="flex items-center gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <polyline points="3 7 12 13 21 7" />
                </svg>
                <a href="mailto:hello@amareen.si" className="hover:text-orange-dark">
                  hello@amareen.si
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>
                  Dvorje 82A, 4207 Cerklje na Gorenjskem
                  <br />
                  Slovenia, EU
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7h18M3 12h18M3 17h18" />
                </svg>
                <span className="text-slate">JENIX GROUP, d.o.o.</span>
              </li>
            </ul>

            {/* Social */}
            <div className="mt-6 flex gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full text-ink ring-1 ring-orange-dark/20 transition-colors hover:bg-orange hover:text-pearl hover:ring-orange"
                >
                  <SocialIcon name={s.name} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {linkCols.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h4 className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-orange-dark">
                {col.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.items.map((it) => (
                  <li key={it.label}>
                    <a
                      href={it.href}
                      className="text-[13px] font-medium text-ink/80 transition-colors hover:text-orange-dark"
                    >
                      {it.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Stay in touch column */}
          <div className="md:col-span-2">
            <h4 className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-orange-dark">
              Stay in touch
            </h4>
            <p className="mt-4 text-[13px] text-slate">
              Get 15% off + early access to new arrivals.
            </p>
            <a
              href="#newsletter"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-orange-dark px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-wider text-pearl transition-colors hover:bg-orange"
              style={{ letterSpacing: "0.08em" }}
            >
              <span style={{ color: "#FFFFFF" }}>Subscribe</span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="13 6 19 12 13 18" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Trust + payment strip */}
      <div className="border-t border-orange-dark/10 bg-cream">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-semibold text-slate">
            <span className="inline-flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              </svg>
              Secure checkout
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="6" width="14" height="11" rx="1" />
                <path d="M15 9h4l3 4v4h-7V9Z" />
                <circle cx="6" cy="19" r="2" />
                <circle cx="18" cy="19" r="2" />
              </svg>
              Free delivery over 150 €
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9" />
                <path d="m3 12 4-4M3 12l4 4" />
                <path d="M21 12a9 9 0 0 1-9 9" />
                <path d="m21 12-4 4M21 12l-4-4" />
              </svg>
              30-day returns
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {payments.map((p) => (
              <span
                key={p}
                className="rounded-md border border-orange-dark/15 bg-pearl px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink/70"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-orange-dark/10 bg-pearl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-[12px] text-slate md:flex-row md:px-8">
          <p>
            © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            <li>
              <a href="#" className="hover:text-orange-dark">
                Privacy policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-dark">
                Terms of service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-dark">
                Cookie settings
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-dark">
                Imprint
              </a>
            </li>
          </ul>
          <p className="text-slate/80">EUR · English</p>
        </div>
      </div>
    </footer>
  );
}
