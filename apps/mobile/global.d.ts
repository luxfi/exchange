<<<<<<< HEAD
// biome-ignore-all lint/suspicious/noExplicitAny: required here
=======
/* oxlint-disable typescript/no-explicit-any -- required here */
>>>>>>> upstream/main
/**
 * The global chrome object is not available at runtime in mobile but is
 * required for TypeScript compilation due to its use in the utilities package
 */
declare let chrome: {
<<<<<<< HEAD
  runtime: any
=======
  // oxlint-disable-next-line typescript/no-explicit-any -- biome-parity: oxlint is stricter here
  runtime: any
  // oxlint-disable-next-line typescript/no-explicit-any -- biome-parity: oxlint is stricter here
>>>>>>> upstream/main
  [key: string]: any
}

/**
 * Module augmentation to @datadog deep import for tsgo compatibility
 */
declare module '@datadog/mobile-react-native/lib/typescript/rum/eventMappers/errorEventMapper' {
<<<<<<< HEAD
=======
  // oxlint-disable-next-line typescript/no-explicit-any -- biome-parity: oxlint is stricter here
>>>>>>> upstream/main
  export type ErrorEventMapper = (event: any) => any | null
}
