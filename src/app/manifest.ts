import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "길울림 (Street Resonance)",
    short_name: "길울림",
    description:
      "퇴근 후, 길 위에서 음악으로 이어지는 순간. 직장인 보컬 소모임 길울림.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#7c3aed",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
