import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // "api" is the Docker Compose service name for the backend container, not "localhost" —
      // inside Docker's network, containers reach each other by service name. If you run this
      // client with `npm run dev` directly on your machine (outside Docker) instead, change
      // this back to "http://localhost:4000".
      "/api": "http://api:4000",
    },
  },
});
