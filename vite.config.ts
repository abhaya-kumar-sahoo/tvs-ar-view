import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/",

  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      "7505-2405-201-5019-c1ad-f1da-ebf6-98da-961f.ngrok-free.app",
    ],
  },
});
