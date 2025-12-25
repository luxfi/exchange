/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output mode: standalone for Docker, export for GitHub Actions
  output: process.env.GITHUB_ACTIONS ? "export" : process.env.DOCKER_BUILD ? "standalone" : undefined,

  // Use trailing slashes for compatibility
  trailingSlash: true,

  // Base path
  basePath: "",

  // Asset prefix for proper loading
  assetPrefix: process.env.NEXT_PUBLIC_APP_URL || "",

  devIndicators: false,

  // Don't scan legacy src/pages directory
  // Use pageExtensions with .page.tsx to distinguish if needed
  // For now, we only use App Router (app/ directory)

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
