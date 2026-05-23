import type { Metadata } from "next";
import "./globals.css";
import LangProvider from "@/components/LangProvider";
import { CartProvider } from "@/lib/cart/cart-context";

export const metadata: Metadata = {
  title: "Eloria — Kjer domišljija raste naravno",
  description:
    "Ročno izdelane lesene igrače in organska otroška oblačila. 100% naravni materiali, otrokom prijazne obdelave, brezplačna dostava v Sloveniji.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sl">
      <body className="font-body text-text-dark antialiased">
        <LangProvider>
          <CartProvider>{children}</CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}
