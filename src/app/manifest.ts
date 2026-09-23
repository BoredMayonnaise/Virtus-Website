import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Virtus Labs — Agency Platform & Operations OS",
    short_name: "Virtus OS",
    description: "Independent Digital Studio & Operational Infrastructure",
    start_url: "/",
    display: "standalone",
    background_color: "#0A1118",
    theme_color: "#0F1B2A",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
