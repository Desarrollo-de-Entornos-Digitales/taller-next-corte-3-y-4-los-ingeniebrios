import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";

// Load Plus Jakarta Sans font with specified weights
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Root layout component that wraps the entire application
// Applies global styles and font configuration
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={plusJakarta.className}>{children}</body>
    </html>
  );
}