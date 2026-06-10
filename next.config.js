/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress:        true,
  // swcMinify removed — SWC minification is default in Next.js 15+

  images: {
    unoptimized: false,
  },

  // Turbopack is default in Next.js 16 — explicit config silences the warning
  // fs/path stubs for Three.js are handled automatically by Turbopack
  turbopack: {},

  // Tree-shake heavy packages — drops unused exports at build time
  experimental: {
    optimizePackageImports: [
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'framer-motion',
      'gsap',
    ],
  },
}

module.exports = nextConfig