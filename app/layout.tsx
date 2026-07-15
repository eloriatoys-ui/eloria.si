import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import LangProvider from "@/components/LangProvider";
import PromoPopup from "@/components/PromoPopup";
import { CartProvider } from "@/lib/cart/cart-context";

// Meta (Facebook) Pixel ID.
const FB_PIXEL_ID = "887907974366896";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.eloria.si"),
  title: "Eloria — Kjer domišljija raste naravno",
  description:
    "Ročno izdelane lesene igrače in organska otroška oblačila. 100% naravni materiali, otrokom prijazne obdelave, brezplačna dostava v Sloveniji.",
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sl">
      <head>
        {/* Meta Pixel Code */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${FB_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
      </head>
      <body className="font-body text-text-dark antialiased">
        {/* Meta Pixel — noscript fallback */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
        <LangProvider>
          <CartProvider>
            {children}
            <PromoPopup />
          </CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}
