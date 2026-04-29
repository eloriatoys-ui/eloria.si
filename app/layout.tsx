import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WoodLand Toys — Where Imagination Grows Naturally",
  description:
    "Handcrafted wooden toys and organic kids' clothes. 100% natural materials, child-safe finishes, free UAE delivery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body text-text-dark antialiased">{children}</body>
    </html>
  );
}
