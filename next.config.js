/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'newsletter-dev-bucket.s3.us-east-2.amazonaws.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'www.flaticon.com',
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;
