/** @type {import('next').NextConfig} */
const dedicatedEndPoint = "https://sepolia.infura.io";
const nextConfig = {
  // reactStrictMode: true,
  images: {
    domains: ["gateway.pinata.cloud"],
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  },
  webpack(config, { isServer }) {
    // Add custom rules to handle image imports (jpg, jpeg, png, gif)
    config.module.rules.push({
      test: /\.(gif)$/i, // Match jpg, jpeg, png, and gif
      use: [
        {
          loader: 'file-loader', // or 'url-loader', depending on your needs
          options: {
            name: '[name].[ext]', // Maintain the original file name
            outputPath: 'images/', // Store images in a folder called 'images'
          },
        },
      ],
    });

    // Return the modified config
    return config;
  },
};

module.exports = nextConfig;
