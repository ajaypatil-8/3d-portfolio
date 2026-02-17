/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Compress all responses
  compress: true,
  // Faster refresh and smaller bundles
  swcMinify: true,
  // Don't block rendering on image errors
  images: {
    unoptimized: false,
  },
  webpack: (config, { isServer }) => {
    // Ignore fs/path in client bundle (Three.js GLTFLoader needs this)
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
