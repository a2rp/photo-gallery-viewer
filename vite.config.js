import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/photo-gallery-viewer/",
    build: { sourcemap: false },
    plugins: [react()],
});