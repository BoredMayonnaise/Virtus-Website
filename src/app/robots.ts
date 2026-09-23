import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://virtus-website.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/#work", "/#services", "/#products", "/#brief", "/#faq"],
        disallow: ["/api/", "/operations", "/admin", "/portal"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
