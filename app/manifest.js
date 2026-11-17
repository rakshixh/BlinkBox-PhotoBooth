export default function manifest() {
  return {
    id: "/",
    name: "BlinkBox Photo Booth",
    short_name: "BlinkBox",
    description: "Make vintage photo prints and strips on your device.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f4f0e8",
    theme_color: "#f4f0e8",
    orientation: "portrait-primary",
    icons: [
      { src: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-512.svg", sizes: "512x512", type: "image/svg+xml", purpose: "any maskable" },
    ],
  };
}
