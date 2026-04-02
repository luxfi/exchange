/**
 * ConsoleLogTransport
 *
 * Writes log entries to the browser console. Dev only.
 */

import type { LogEntry, LogTransport } from '../types'

function formatEntry(entry: LogEntry): string {
  const service = entry.service ? `[${entry.service}] ` : ''
  return `${entry.timestamp} ${entry.level.toUpperCase()} ${service}${entry.message}`
}

export function createConsoleTransport(): LogTransport {
  return {
    send(entries): void {
      for (const entry of entries) {
        const formatted = formatEntry(entry)
        const extra = entry.context ?? {}

        switch (entry.level) {
          case 'error':
          case 'fatal':
            // biome-ignore lint/suspicious/noConsole: Logger transport implementation
            console.error(formatted, entry.error ?? '', extra)
            break
          case 'warn':
            // biome-ignore lint/suspicious/noConsole: Logger transport implementation
            console.warn(formatted, extra)
            break
          default:
            // biome-ignore lint/suspicious/noConsole: Logger transport implementation
            console.debug(formatted, extra)
            break
        }
      }
    },
  }
}
