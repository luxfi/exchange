/* oxlint-disable no-console -- util script */
// This ensures the web app entry js size is under a limit

// NOTE: not using a typical jest/.test.ts file because this test requires the
// production app to be built, so we want to be able to run it separately in CI

import { readFileSync } from 'fs'
import { join } from 'path'

type BundleAnalysisJson = {
  statSize?: number
  parsedSize?: number
  gzipSize?: number
  isInitialByEntrypoint: { main?: boolean }
}[]

let report: BundleAnalysisJson

try {
  const outputfile = join(__dirname, '../../build/report.json')
  report = JSON.parse(readFileSync(outputfile, 'utf-8'))
} catch (err) {
  // oxlint-disable-next-line no-console -- biome-parity: oxlint is stricter here
  console.error(`Bundle size has grown too big! Entry JS size is ${entryGzipSize}, over the limit of ${limit}.`)
  process.exit(1)
}

if (entryGzipSize + maxBuffer < limit) {
// oxlint-disable-next-line no-console -- biome-parity: oxlint is stricter here
console.info(`Success! Entry JS size is ${entryGzipSize}, less than the limit of ${limit}.`)
