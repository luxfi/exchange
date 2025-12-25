/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for deployment
  output: process.env.GITHUB_ACTIONS ? "export" : undefined,

  // Use trailing slashes for compatibility
  trailingSlash: true,

  // Base path
  basePath: "",

  // Asset prefix for proper loading
  assetPrefix: process.env.NEXT_PUBLIC_APP_URL || "",

  devIndicators: false,

  typescript: {
    // TODO: Remove after full migration
    ignoreBuildErrors: true,
  },

  eslint: {
    // TODO: Remove after full migration
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "tokens.uniswap.org",
      },
      {
        protocol: "https",
        hostname: "*.lux.network",
      },
    ],
    unoptimized: process.env.GITHUB_ACTIONS ? true : false,
  },

  // Webpack config for web3 compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }

    // Handle SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },

  // Transpile packages
  transpilePackages: [
    "@uniswap/widgets",
    "@uniswap/conedison",
    "@uniswap/smart-order-router",
  ],

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
}

export default nextConfig
