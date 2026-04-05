<<<<<<< HEAD
import { TestID } from '../../../../../pkgs/lx/src/test/fixtures/testIDs'
=======
import { TestID } from '../../../../../packages/uniswap/src/test/fixtures/testIDs'
>>>>>>> upstream/main

const output: Record<string, string> = {}

// Convert TestID enum to Maestro-friendly format
Object.entries(TestID).forEach(([key, value]) => {
  output[key] = value
})

// Output in Maestro-compatible JavaScript format
console.log(`
// Auto-generated from TestID enum
output.testIds = ${JSON.stringify(output, null, 2)}
`)
