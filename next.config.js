/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Base path for v2 deployment
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  
  // Asset prefix for CDN
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
  
  // Environment variables
  env: {
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'wss://api.lux.exchange/v2/ws',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.lux.exchange/v2',
    NEXT_PUBLIC_WC_PROJECT_ID: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
  },

  // Rewrites for dual frontend setup
  async rewrites() {
    return [
      // V2 trading interface routes
      {
        source: '/v2',
        destination: '/trade',
      },
      {
        source: '/v2/trade',
        destination: '/trade',
      },
      {
        source: '/v2/trade/:market',
        destination: '/trade?market=:market',
      },
      // Legacy Uniswap interface at root
      {
        source: '/',
        destination: '/legacy',
      },
      {
        source: '/swap',
        destination: '/legacy/swap',
      },
      {
        source: '/pool',
        destination: '/legacy/pool',
      },
    ]
  },

  // Headers for CORS and security
  async headers() {
    return [
      {
        source: '/v2/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
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
            key: 'Access-Control-Allow-Origin',
            value: process.env.ALLOWED_ORIGINS || 'https://lux.exchange',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
          },
        ],
      },
    ]
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Handle node modules that need to be transpiled
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    }

    // Add custom webpack rules
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
        },
      },
    })

    return config
  },

  // Image optimization
  images: {
    domains: ['lux.exchange', 'lux.network', 'api.lux.exchange'],
    formats: ['image/avif', 'image/webp'],
  },

  // Experimental features
  experimental: {
    optimizeFonts: true,
    optimizeImages: true,
    scrollRestoration: true,
  },

  // Production optimizations
  productionBrowserSourceMaps: false,
  compress: true,
  
  // TypeScript
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },

  // ESLint
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
}

module.exports = nextConfig