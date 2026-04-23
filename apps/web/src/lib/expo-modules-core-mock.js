// Mock for expo-modules-core on web.
//
// expo-modules-core is a React Native bridge package. The web build uses
// react-native-web plus web-specific implementations, so native bridge
// primitives are not needed. Upstream expo-modules-core >=55 ships an
// `exports` field that points the default subpath at raw `.ts` files
// (Metro convention), which rolldown cannot resolve, producing:
//
//   [MISSING_EXPORT] "EventEmitter" is not exported by
//     expo-modules-core/src/ts-declarations/EventEmitter.ts
//
// Aliasing the package to this stub sidesteps the broken resolution and
// makes the web build deterministic, matching the existing pattern for
// `expo-blur` and `expo-clipboard` in vite.config.mts.

// ---- Classes used as base classes / `instanceof` targets -------------------

export class CodedError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'CodedError'
    this.code = code
  }
}

export class UnavailabilityError extends CodedError {
  constructor(moduleName, propertyName) {
    super(
      'ERR_UNAVAILABLE',
      `The method or property ${moduleName}.${propertyName} is not available on web, are you sure you've linked all the native dependencies properly?`,
    )
    this.name = 'UnavailabilityError'
  }
}

// Types at runtime are just identity classes — consumers only use them for
// shape-matching or `instanceof` checks.
export class EventEmitter {
  addListener() { return { remove: () => {} } }
  emit() {}
  removeAllListeners() {}
  removeSubscription() {}
}
export class NativeModule extends EventEmitter {}
export class SharedObject extends EventEmitter {}
export class SharedRef extends SharedObject {}

// ---- Module-resolution helpers --------------------------------------------
//
// On web these always return an empty proxy. Any method call on the returned
// object is a no-op; any property access returns another proxy. This makes
// transitive expo-* package initialisers (which do `const M =
// requireNativeModule(...)` at import time) tree-shake-able / harmless on
// web without needing to patch each downstream package.

const noopProxy = new Proxy(function () {}, {
  get: (target, prop) => {
    if (prop === 'then') return undefined // not a thenable
    if (prop === Symbol.toPrimitive) return () => ''
    return noopProxy
  },
  apply: () => noopProxy,
  construct: () => noopProxy,
})

export function requireNativeModule() { return noopProxy }
export function requireOptionalNativeModule() { return null }
export function requireNativeViewManager() { return noopProxy }
export function registerWebModule(module) { return module }

// ---- Platform shim ---------------------------------------------------------

export const Platform = {
  OS: 'web',
  Version: undefined,
  isTesting: false,
  select(map) {
    if (map == null) return undefined
    if ('web' in map) return map.web
    if ('default' in map) return map.default
    return undefined
  },
}

// ---- Default export --------------------------------------------------------

export default {
  CodedError,
  UnavailabilityError,
  EventEmitter,
  NativeModule,
  SharedObject,
  SharedRef,
  requireNativeModule,
  requireOptionalNativeModule,
  requireNativeViewManager,
  registerWebModule,
  Platform,
}
