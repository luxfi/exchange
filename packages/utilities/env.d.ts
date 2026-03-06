/** biome-ignore-all lint/style/noNamespace: required to define process.env type */

declare global {
  namespace NodeJS {
    // All process.env values used by this package should be listed here
    interface ProcessEnv {
      NODE_ENV?: 'development' | 'production' | 'test'
      IS_E2E_TEST?: string
      IS_LUX_EXTENSION?: string
      JEST_WORKER_ID?: string
      REACT_APP_IS_PLAYWRIGHT_ENV?: string
      REACT_APP_IS_LUX_INTERFACE?: string
      REACT_APP_STAGING?: string
      VITEST_POOL_ID?: string
      VITEST_WORKER_ID?: string
    }
  }
}

export {}
