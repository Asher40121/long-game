import type { NextConfig } from "next";

// `npm run build:demo` sets STATIC_EXPORT=1 to produce a static site for GitHub Pages.
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  ...(isStaticExport && {
    cacheComponents: false,
    partialPrefetching: false,
    output: "export",
    basePath: "/long-game",
    trailingSlash: true,
    distDir: "build-export",
  }),
};

export default nextConfig;
