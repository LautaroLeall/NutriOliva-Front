import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nutriolivaAutoSeoPlugin } from "./scripts/seoAutoPlugin.mjs";

export default defineConfig({
  plugins: [react(), nutriolivaAutoSeoPlugin()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
