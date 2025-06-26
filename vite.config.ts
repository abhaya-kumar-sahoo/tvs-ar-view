import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/",

  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      "33f3-2405-201-5019-c10b-7c1a-384c-c288-6fe6.ngrok-free.app",
    ],
  },
});
