// Stub for @lingui/macro — this codebase uses react-i18next, not Lingui.
// Trans just renders children as-is.
import React from 'react'

export function Trans({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

export function t(strings: TemplateStringsArray, ...values: unknown[]) {
  return String.raw(strings, ...values)
}

export function plural(value: number, options: Record<string, string>) {
  return options[String(value)] || options.other || String(value)
}

export function defineMessage(descriptor: { message: string }) {
  return descriptor.message
}
