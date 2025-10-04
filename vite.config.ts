import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/",

  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ["810d465a3b05.ngrok-free.app"],
  },
});
