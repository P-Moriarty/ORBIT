
import type { Metadata } from "next";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";
import { CartProvider } from "@/components/CartProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orbit 3D | Concept Sound Collection",
  description:
    "Explore and configure a collection of fictional sound-device concepts in 3D.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AccessibilityProvider>
          <CartProvider>{children}</CartProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
