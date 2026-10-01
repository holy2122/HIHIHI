import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import { rmSync } from "node:fs";

// 콘텐츠 원본(healthData.json)은 repo에는 두되, 배포 결과물에는 포함하지 않는다.
// (콘텐츠는 Supabase DB에서 로그인 회원에게만 제공됨)
const stripPrivateContent = (): Plugin => ({
  name: "strip-private-content",
  apply: "build",
  closeBundle() {
    rmSync(path.resolve(import.meta.dirname, "dist/public/healthData.json"), { force: true });
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), stripPrivateContent()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
});
