/** @type {import('next').NextConfig} */
const nextConfig = {
  // Monorepo: transpile workspace packages
  transpilePackages: [
    '@luxfi/ui',
    '@luxfi/exchange',
    '@luxfi/api',
    '@luxfi/config',
    'tamagui',
    '@tamagui/core',
    '@tamagui/animations-react-native',
  ],

  // Output mode: standalone for Docker, export for GitHub Actions
  output: process.env.GITHUB_ACTIONS ? "export" : process.env.DOCKER_BUILD ? "standalone" : undefined,

  trailingSlash: true,
  basePath: "",
  assetPrefix: process.env.NEXT_PUBLIC_APP_URL || "",
  devIndicators: false,

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.coingecko.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "tokens.uniswap.org" },
      { protocol: "https", hostname: "*.lux.network" },
    ],
    unoptimized: process.env.GITHUB_ACTIONS ? true : false,
  },

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
