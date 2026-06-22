import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

// Playfair Display — our elegant, editorial heading font.
// It's a variable font, so we don't need to list specific weights.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

// Poppins — clean, modern font for body text, buttons, inputs, and nav.
// Poppins is NOT variable, so we must list the weights we want to use.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "StyleMate — Your personal shopping assistant",
  description:
    "Discover fashion pieces you'll love. Search and filter products with StyleMate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
