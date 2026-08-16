import type { NextConfig } from "next";
import path from "node:path";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  outputFileTracingRoot: path.join(__dirname, "../.."),
  transpilePackages: ["@compario/data"],
  trailingSlash: true,
  basePath: isGitHubPages ? "/compario" : "",
};

export default nextConfig;
