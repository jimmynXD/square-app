/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['app', 'components', 'context', 'hooks', 'lib', 'queries', 'utils'],
  },
  /*Error: Invalid src prop (https://a.espncdn.com/i/teamlogos/nfl/500/sf.png) on `next/image`, hostname "a.espncdn.com" is not configured under images in your `next.config.js`
See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host */
  images: {
    remotePatterns: [
      {
        hostname: 'a.espncdn.com',
      },
    ],
  },
};

module.exports = nextConfig;
