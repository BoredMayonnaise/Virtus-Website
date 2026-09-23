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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://virtuswebsite.vercel.app"),
  openGraph: {
    title: "The Virtus Labs — Where brand, technology, and content move together.",
    description: "Brand, web, content and automation under one coordinated team.",
    type: "website",
    url: "https://virtuswebsite.vercel.app",
    siteName: "The Virtus Labs",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1024,
        height: 576,
        alt: "The Virtus Labs — One Team Official Studio Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Virtus Labs — Where brand, technology, and content move together.",
    description: "Brand, web, content and automation under one coordinated team.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
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
