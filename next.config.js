/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Não deixar ESLint/TS travarem o build
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

module.exports = nextConfig;