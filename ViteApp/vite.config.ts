import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

const { parsed } = dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  server: {
    port: 3456,
  },
  plugins: [react()],
  define: {
    ...Object.fromEntries(
      Object.entries(parsed)
        .filter(([key]) =>
          ["REACT_APP_", "NODE_"].some((prefix) => key.startsWith(prefix))
        )
        .map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)])
    ),
  },
});
