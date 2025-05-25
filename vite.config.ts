import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // '/api': 'http://localhost:8080',
      '/api': 'http://3.133.159.42:80',
    }
  },
  plugins: [react(), tailwindcss()],
});
