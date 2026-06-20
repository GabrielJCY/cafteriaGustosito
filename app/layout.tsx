import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// Fuente Poppins (moderna, muy legible y con variedad de pesos)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Cafetería Gustosito · Menú",
  description:
    "Administra categorías, productos y pedidos de tu cafetería desde un solo lugar.",
  keywords: "cafetería, gestión, dashboard, productos, pedidos",
  authors: [{ name: "Gustosito" }],
  creator: "Gustosito",
  publisher: "Gustosito",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FBF8F4] text-[#1A0F0A]">
        {children}
      </body>
    </html>
  );
}