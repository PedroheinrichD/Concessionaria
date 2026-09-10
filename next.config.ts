import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ha um package-lock.json solto na pasta do usuario; fixa a raiz aqui.
  turbopack: {
    root: import.meta.dirname,
  },
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
};

export default nextConfig;
