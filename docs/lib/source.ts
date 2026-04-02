import { docs } from "@/.source"
import { loader } from "@hanzo/docs-core/source"

// Create a single source instance that is reused
// This prevents circular references and stack overflow issues
let _source: ReturnType<typeof loader> | null = null

export function getSource() {
  if (!_source) {
    _source = loader({
      baseUrl: "/docs",
      source: docs.toHanzoDocsSource(),
    })
  }
  return _source
}

export const source = getSource()
