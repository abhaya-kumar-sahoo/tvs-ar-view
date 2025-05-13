import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      "bc80-2405-201-5019-c10b-157a-e231-2597-9e17.ngrok-free.app",
    ],
  },
});
