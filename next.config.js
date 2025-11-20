/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Basic Configuration */
  reactStrictMode: true,
  swcMinify: true,

  /* Experimental Features */
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  /* Image Optimization */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/**',
      },
      // Add other image domains as needed
    ],
  },

  /* Environment Variables (public) */
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  /* Headers */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  /* Redirects */
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },

  /* Webpack Configuration (if needed) */
  webpack: (config, { isServer }) => {
    // Custom webpack config
    return config
  },
}

module.exports = nextConfig
