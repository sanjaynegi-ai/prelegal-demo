const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/prelegal-demo" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
};

module.exports = nextConfig;
