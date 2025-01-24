import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const reactPlugin = react();

// https://vite.dev/config/
export default defineConfig({
  plugins: [reactPlugin],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
