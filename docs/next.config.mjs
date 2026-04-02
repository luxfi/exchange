import { createMDX } from "@hanzo/docs-mdx/next"

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    webpackBuildWorker: true,
  },
  images: {
    unoptimized: true,
  },
}

const withMDX = createMDX()

export default withMDX(config)
