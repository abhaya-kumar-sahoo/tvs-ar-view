import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/",

  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ["11f3-2405-201-5019-c10b-f0fe-2802-d1-413c.ngrok-free.app"],
  },
});
