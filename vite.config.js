import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // Still critical for relative paths!
  build: {
    outDir: "dist", // ✅ Back to "dist"
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});