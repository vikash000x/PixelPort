/** @type {import('next').NextConfig} */
const dedicatedEndPoint = 'https://sepolia.infura.io';
const nextConfig = {
 // reactStrictMode: true,
  images: {
    domains: ["gateway.pinata.cloud"],
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  },
};

module.exports = nextConfig;
