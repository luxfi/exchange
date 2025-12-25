import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import { configDefaults, defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "**/*.test.{ts,tsx}",
      "**/*.spec.{ts,tsx}",
    ],
    exclude: [
      ...configDefaults.exclude,
      "**/node_modules/**",
      "**/cypress/**",
      "**/e2e/**",
      "**/.next/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: [
        "components/**/*.{ts,tsx}",
        "hooks/**/*.{ts,tsx}",
        "lib/**/*.{ts,tsx}",
        "utils/**/*.{ts,tsx}",
        "state/**/*.{ts,tsx}",
      ],
      exclude: [
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "**/types/**",
      ],
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  plugins: [
    react(),
    tsconfigPaths({
      ignoreConfigErrors: true,
    }),
  ],
  resolve: {
    alias: {
      "@": ".",
    },
  },
})
