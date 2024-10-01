/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['app', 'components', 'context', 'hooks', 'lib', 'queries', 'utils'],
  },
};

module.exports = nextConfig;
