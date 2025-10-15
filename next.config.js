/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['pt','en','es','fr','de'],
    defaultLocale: 'pt',
  },
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;