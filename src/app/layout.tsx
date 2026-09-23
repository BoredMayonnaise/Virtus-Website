import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const viewport: Viewport = {
  themeColor: "#0F1B2A",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "The Virtus Labs — Where brand, technology, and content move together.",
  description:
    "The Virtus Labs brings brand, web, content and automation under one coordinated digital studio.",
  applicationName: "The Virtus Labs",
  openGraph: {
    title: "The Virtus Labs — Where brand, technology, and content move together.",
    description: "Brand, web, content and automation under one coordinated team.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-abyss text-seaglass min-h-screen antialiased selection:bg-tvl-amber/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
