import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  server: {
    host: "0.0.0.0", // Listen on all network interfaces
    port: 3000,
    strictPort: true,
    allowedHosts: [
      "https://construction-ui-stg.addisababadbohra.com", // 👈 your staging domain
      ".addisabadbohra.com", // optional wildcard for subdomains
      "localhost",
      "127.0.0.1",
    ],
  },
});
