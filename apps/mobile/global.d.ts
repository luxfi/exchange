/* oxlint-disable typescript/no-explicit-any -- required here */
/**
 * The global chrome object is not available at runtime in mobile but is
 * required for TypeScript compilation due to its use in the utilities package
 */
declare let chrome: {
  // oxlint-disable-next-line typescript/no-explicit-any -- biome-parity: oxlint is stricter here
  runtime: any
  // oxlint-disable-next-line typescript/no-explicit-any -- biome-parity: oxlint is stricter here
  [key: string]: any
}
