var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../packages/ui/src/tamagui.config.ts
var tamagui_config_exports = {};
__export(tamagui_config_exports, {
  config: () => config,
  default: () => tamagui_config_default
});
module.exports = __toCommonJS(tamagui_config_exports);

// ../../node_modules/.pnpm/@tamagui+constants@1.136.1_react-native@0.79.5_@babel+core@7.28.5_@react-native-communi_6f554b4e000341b6296eb6d07dded0fa/node_modules/@tamagui/constants/dist/esm/constants.mjs
var import_react = __toESM(require("react"), 1);
var IS_REACT_19 = typeof import_react.default.use < "u";
var isWeb = true;
var isWindowDefined = typeof window < "u";
var isServer = isWeb && !isWindowDefined;
var isClient = isWeb && isWindowDefined;
var useIsomorphicLayoutEffect = isServer ? import_react.useEffect : import_react.useLayoutEffect;
var isChrome = typeof navigator < "u" && /Chrome/.test(navigator.userAgent || "");
var isWebTouchable = isClient && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
var isIos = process.env.TEST_NATIVE_PLATFORM === "ios";

// ../../node_modules/.pnpm/@tamagui+use-presence@1.136.1_react-dom@19.2.3_react@19.0.3__react-native@0.79.5_@babel_6f5d217e12495e61d82a5344e42f53b3/node_modules/@tamagui/use-presence/dist/esm/PresenceContext.mjs
var React2 = __toESM(require("react"), 1);
var import_jsx_runtime = require("react/jsx-runtime");
var PresenceContext = React2.createContext(null);
var ResetPresence = /* @__PURE__ */ __name((props) => {
  const parent = React2.useContext(PresenceContext);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PresenceContext.Provider, {
    value: props.disable ? parent : null,
    children: props.children
  });
}, "ResetPresence");

// ../../node_modules/.pnpm/@tamagui+use-presence@1.136.1_react-dom@19.2.3_react@19.0.3__react-native@0.79.5_@babel_6f5d217e12495e61d82a5344e42f53b3/node_modules/@tamagui/use-presence/dist/esm/usePresence.mjs
var React3 = __toESM(require("react"), 1);
function usePresence() {
  const context = React3.useContext(PresenceContext);
  if (!context) return [true, null, context];
  const {
    id,
    isPresent: isPresent2,
    onExitComplete,
    register
  } = context;
  return React3.useEffect(() => register(id), []), !isPresent2 && onExitComplete ? [false, () => onExitComplete?.(id), context] : [true, void 0, context];
}
__name(usePresence, "usePresence");

// ../../node_modules/.pnpm/@tamagui+react-native-media-driver@1.136.1_react-dom@19.2.3_react@19.0.3__react-native@_e004ba3171a7d3ba481f14d7989f5292/node_modules/@tamagui/react-native-media-driver/dist/esm/createMedia.mjs
var import_web = require("@tamagui/core");

// ../../node_modules/.pnpm/@tamagui+react-native-media-driver@1.136.1_react-dom@19.2.3_react@19.0.3__react-native@_e004ba3171a7d3ba481f14d7989f5292/node_modules/@tamagui/react-native-media-driver/dist/esm/matchMedia.mjs
var matchMedia = globalThis.matchMedia;

// ../../node_modules/.pnpm/@tamagui+react-native-media-driver@1.136.1_react-dom@19.2.3_react@19.0.3__react-native@_e004ba3171a7d3ba481f14d7989f5292/node_modules/@tamagui/react-native-media-driver/dist/esm/createMedia.mjs
function createMedia(media2) {
  return (0, import_web.setupMatchMedia)(matchMedia), media2;
}
__name(createMedia, "createMedia");

// ../../node_modules/.pnpm/tamagui@1.136.1_react-dom@19.2.3_react@19.0.3__react-native@0.79.5_@babel+core@7.28.5_@_2d97d772d66ccbf8fe20a2e81ae4f808/node_modules/tamagui/dist/esm/createTamagui.mjs
var import_core = require("@tamagui/core");
var createTamagui = process.env.NODE_ENV !== "development" ? import_core.createTamagui : (conf) => {
  const sizeTokenKeys = ["$true"], hasKeys = /* @__PURE__ */ __name((expectedKeys, obj) => expectedKeys.every((k) => typeof obj[k] < "u"), "hasKeys"), tamaguiConfig = (0, import_core.createTamagui)(conf);
  for (const name of ["size", "space"]) {
    const tokenSet = tamaguiConfig.tokensParsed[name];
    if (!tokenSet) throw new Error(`Expected tokens for "${name}" in ${Object.keys(tamaguiConfig.tokensParsed).join(", ")}`);
    if (!hasKeys(sizeTokenKeys, tokenSet)) throw new Error(`
createTamagui() missing expected tokens.${name}:

Received: ${Object.keys(tokenSet).join(", ")}

Expected: ${sizeTokenKeys.join(", ")}

Tamagui expects a "true" key that is the same value as your default size. This is so 
it can size things up or down from the defaults without assuming which keys you use.

Please define a "true" or "$true" key on your size and space tokens like so (example):

size: {
  sm: 2,
  md: 10,
  true: 10, // this means "md" is your default size
  lg: 20,
}

`);
  }
  const expected = Object.keys(tamaguiConfig.tokensParsed.size);
  for (const name of ["radius", "zIndex"]) {
    const tokenSet = tamaguiConfig.tokensParsed[name], received = Object.keys(tokenSet);
    if (!received.some((rk) => expected.includes(rk))) throw new Error(`
createTamagui() invalid tokens.${name}:

Received: ${received.join(", ")}

Expected a subset of: ${expected.join(", ")}

`);
  }
  return tamaguiConfig;
};

// ../../node_modules/.pnpm/@tamagui+animations-css@1.136.1_react-dom@19.2.3_react@19.0.3__react-native@0.79.5_@bab_1fbdafc50e5bcc028c5876ef69b44c10/node_modules/@tamagui/animations-css/dist/esm/createAnimations.mjs
var import_web2 = require("@tamagui/core");
var import_react2 = __toESM(require("react"), 1);
function extractDuration(animation) {
  const msMatch = animation.match(/(\d+(?:\.\d+)?)\s*ms/);
  if (msMatch) return Number.parseInt(msMatch[1], 10);
  const sMatch = animation.match(/(\d+(?:\.\d+)?)\s*s/);
  return sMatch ? Math.round(Number.parseFloat(sMatch[1]) * 1e3) : 300;
}
__name(extractDuration, "extractDuration");
function createAnimations(animations2) {
  const reactionListeners = /* @__PURE__ */ new WeakMap();
  return {
    animations: animations2,
    usePresence,
    ResetPresence,
    supportsCSS: true,
    useAnimatedNumber(initial) {
      const [val, setVal] = import_react2.default.useState(initial), [onFinish, setOnFinish] = (0, import_react2.useState)();
      return useIsomorphicLayoutEffect(() => {
        onFinish && (onFinish?.(), setOnFinish(void 0));
      }, [onFinish]), {
        getInstance() {
          return setVal;
        },
        getValue() {
          return val;
        },
        setValue(next, config2, onFinish2) {
          setVal(next), setOnFinish(onFinish2);
        },
        stop() {
        }
      };
    },
    useAnimatedNumberReaction({
      value
    }, onValue) {
      import_react2.default.useEffect(() => {
        const instance = value.getInstance();
        let queue = reactionListeners.get(instance);
        if (!queue) {
          const next = /* @__PURE__ */ new Set();
          reactionListeners.set(instance, next), queue = next;
        }
        return queue.add(onValue), () => {
          queue?.delete(onValue);
        };
      }, []);
    },
    useAnimatedNumberStyle(val, getStyle) {
      return getStyle(val.getValue());
    },
    useAnimations: /* @__PURE__ */ __name(({
      props,
      presence,
      style,
      componentState,
      stateRef
    }) => {
      const isEntering = !!componentState.unmounted, isExiting = presence?.[0] === false, sendExitComplete = presence?.[1], [animationKey, animationConfig] = Array.isArray(props.animation) ? props.animation : [props.animation], animation = animations2[animationKey], keys = props.animateOnly ?? ["all"];
      return useIsomorphicLayoutEffect(() => {
        const host = stateRef.current.host;
        if (!sendExitComplete || !isExiting || !host) return;
        const node = host, fallbackTimeout = animation ? extractDuration(animation) : 200, timeoutId = setTimeout(() => {
          sendExitComplete?.();
        }, fallbackTimeout), onFinishAnimation = /* @__PURE__ */ __name(() => {
          clearTimeout(timeoutId), sendExitComplete?.();
        }, "onFinishAnimation");
        return node.addEventListener("transitionend", onFinishAnimation), node.addEventListener("transitioncancel", onFinishAnimation), () => {
          clearTimeout(timeoutId), node.removeEventListener("transitionend", onFinishAnimation), node.removeEventListener("transitioncancel", onFinishAnimation);
        };
      }, [sendExitComplete, isExiting]), animation && (Array.isArray(style.transform) && (style.transform = (0, import_web2.transformsToString)(style.transform)), style.transition = keys.map((key) => {
        const override = animations2[animationConfig?.[key]] ?? animation;
        return `${key} ${override}`;
      }).join(", ")), process.env.NODE_ENV === "development" && props.debug === "verbose" && console.info("CSS animation", {
        props,
        animations: animations2,
        animation,
        animationKey,
        style,
        isEntering,
        isExiting
      }), animation ? {
        style,
        className: isEntering ? "t_unmounted" : ""
      } : null;
    }, "useAnimations")
  };
}
__name(createAnimations, "createAnimations");

// ../../packages/ui/src/theme/animations/index.web.ts
var animations = createAnimations({
  "100ms": "100ms ease-in-out",
  "125ms": "125ms ease-in-out",
  "125msDelayed": "125ms ease-in-out 250ms",
  "125msDelayedLong": "125ms ease-in-out 2000ms",
  "200ms": "200ms ease-in-out",
  // Delay animations (matching delay200ms.ts pattern)
  "200msDelayed1ms": "200ms ease-out 1ms",
  "200msDelayed40ms": "200ms ease-out 40ms",
  "200msDelayed80ms": "200ms ease-out 80ms",
  "200msDelayed120ms": "200ms ease-out 120ms",
  "200msDelayed160ms": "200ms ease-out 160ms",
  "200msDelayed200ms": "200ms ease-out 200ms",
  "200msDelayed240ms": "200ms ease-out 240ms",
  "300ms": "300ms ease-in-out",
  "300msDelayed": "300ms ease-in-out 150ms",
  "80ms-ease-in-out": "80ms ease-in-out",
  // Spring approximations using cubic-bezier
  // stiff: high stiffness (400), high damping (200) - very snappy
  stiff: "150ms cubic-bezier(0.17, 0.67, 0.45, 1)",
  // bouncy: low damping (10), medium stiffness (100) - bounces a lot
  bouncy: "400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
  // semiBouncy: slightly more damping than bouncy
  semiBouncy: "350ms cubic-bezier(0.25, 1.25, 0.5, 1)",
  // lazy: low stiffness (60), medium damping (20) - slow and smooth
  lazy: "500ms cubic-bezier(0.25, 0.1, 0.25, 1)",
  // quick: medium-high stiffness (250), medium damping (20)
  quick: "200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  // quicker: high stiffness (390), slightly less damping
  quicker: "180ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  // quickishDelayed: like quicker but with delay
  quickishDelayed: "200ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 70ms",
  // fast: very high stiffness (1000), high damping (75) - instant feel
  fast: "100ms cubic-bezier(0.17, 0.67, 0.45, 1)",
  // fastHeavy: like fast but heavier mass
  fastHeavy: "120ms cubic-bezier(0.17, 0.67, 0.45, 1)",
  // fastExit: very fast exit animation
  fastExit: "80ms cubic-bezier(0.17, 0.67, 0.45, 1)",
  // fastExitHeavy: like fastExit but heavier
  fastExitHeavy: "100ms cubic-bezier(0.17, 0.67, 0.45, 1)",
  // simple: basic timing
  simple: "80ms ease-in-out"
});

// ../../packages/ui/src/theme/fonts.ts
var import_core2 = require("@tamagui/core");

// ../../packages/ui/src/utils/needs-small-font.ts
var needsSmallFont = /* @__PURE__ */ __name(() => {
  return true;
}, "needsSmallFont");

// ../../packages/utilities/src/platform/index.ts
var isWebPlatform = false;
var isMobileApp = false;
var isWebApp = false;

// ../../packages/ui/src/theme/fonts.ts
var adjustedSize = /* @__PURE__ */ __name((fontSize2) => {
  if (needsSmallFont()) {
    return fontSize2;
  }
  return fontSize2 + 1;
}, "adjustedSize");
var fontFamilyByPlatform = {
  android: {
    medium: "Basel-Grotesk-Medium",
    book: "Basel-Grotesk-Book"
  },
  ios: {
    medium: "Basel Grotesk",
    book: "Basel Grotesk"
  },
  web: {
    medium: "Basel Grotesk Medium",
    book: "Basel Grotesk Book"
  }
};
var platform = isWebPlatform ? "web" : import_core2.isAndroid ? "android" : "ios";
var fontFamily = {
  serif: "serif",
  sansSerif: {
    // iOS uses the name embedded in the font
    book: fontFamilyByPlatform[platform].book,
    medium: fontFamilyByPlatform[platform].medium,
    monospace: "InputMono-Regular"
  }
};
var baselMedium = isWebPlatform ? 'Basel, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' : fontFamily.sansSerif.medium;
var baselBook = isWebPlatform ? 'Basel, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' : fontFamily.sansSerif.book;
var monospaceFontFamily = isWebPlatform ? 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Courier New", monospace' : fontFamily.sansSerif.monospace;
var platformFontFamily = /* @__PURE__ */ __name((family) => {
  if (isWebPlatform) {
    return family;
  }
  return fontFamily.sansSerif[family];
}, "platformFontFamily");
var BOOK_WEIGHT = "400";
var BOOK_WEIGHT_WEB = "485";
var MEDIUM_WEIGHT = "500";
var MEDIUM_WEIGHT_WEB = "535";
var defaultWeights = {
  book: isWebApp ? BOOK_WEIGHT_WEB : BOOK_WEIGHT,
  true: isWebApp ? BOOK_WEIGHT_WEB : BOOK_WEIGHT,
  medium: isWebApp ? MEDIUM_WEIGHT_WEB : MEDIUM_WEIGHT
};
var NATIVE_LINE_HEIGHT_SCALE = 1.15;
var fonts = {
  heading1: {
    family: platformFontFamily("book"),
    fontSize: adjustedSize(52),
    lineHeight: adjustedSize(52) * 0.96,
    fontWeight: BOOK_WEIGHT,
    maxFontSizeMultiplier: 1.2,
    letterSpacing: "-2%"
  },
  heading2: {
    family: platformFontFamily("book"),
    fontSize: adjustedSize(36),
    lineHeight: 40,
    fontWeight: BOOK_WEIGHT,
    maxFontSizeMultiplier: 1.2,
    letterSpacing: "-1%"
  },
  heading3: {
    family: platformFontFamily("book"),
    fontSize: adjustedSize(24),
    lineHeight: adjustedSize(24) * 1.2,
    fontWeight: BOOK_WEIGHT,
    maxFontSizeMultiplier: 1.2,
    letterSpacing: "-0.5%"
  },
  subheading1: {
    family: platformFontFamily("book"),
    fontSize: adjustedSize(18),
    lineHeight: 24,
    fontWeight: BOOK_WEIGHT,
    maxFontSizeMultiplier: 1.4
  },
  subheading2: {
    family: platformFontFamily("book"),
    fontSize: adjustedSize(16),
    lineHeight: 20,
    fontWeight: BOOK_WEIGHT,
    maxFontSizeMultiplier: 1.4
  },
  body1: {
    family: platformFontFamily("book"),
    fontSize: adjustedSize(18),
    lineHeight: adjustedSize(18) * 1.3,
    fontWeight: BOOK_WEIGHT,
    maxFontSizeMultiplier: 1.4
  },
  body2: {
    family: platformFontFamily("book"),
    fontSize: adjustedSize(16),
    lineHeight: adjustedSize(16) * 1.3,
    fontWeight: BOOK_WEIGHT,
    maxFontSizeMultiplier: 1.4
  },
  body3: {
    family: platformFontFamily("book"),
    fontSize: adjustedSize(14),
    lineHeight: adjustedSize(14) * 1.3,
    fontWeight: BOOK_WEIGHT,
    maxFontSizeMultiplier: 1.4
  },
  body4: {
    family: platformFontFamily("book"),
    fontSize: adjustedSize(12),
    lineHeight: 16,
    fontWeight: BOOK_WEIGHT,
    maxFontSizeMultiplier: 1.4
  },
  buttonLabel1: {
    family: platformFontFamily("medium"),
    fontSize: adjustedSize(18),
    lineHeight: adjustedSize(18) * NATIVE_LINE_HEIGHT_SCALE,
    fontWeight: MEDIUM_WEIGHT,
    maxFontSizeMultiplier: 1.2
  },
  buttonLabel2: {
    family: platformFontFamily("medium"),
    fontSize: adjustedSize(16),
    lineHeight: adjustedSize(16) * NATIVE_LINE_HEIGHT_SCALE,
    fontWeight: MEDIUM_WEIGHT,
    maxFontSizeMultiplier: 1.2
  },
  buttonLabel3: {
    family: platformFontFamily("medium"),
    fontSize: adjustedSize(14),
    lineHeight: adjustedSize(14) * NATIVE_LINE_HEIGHT_SCALE,
    fontWeight: MEDIUM_WEIGHT,
    maxFontSizeMultiplier: 1.2
  },
  buttonLabel4: {
    family: platformFontFamily("medium"),
    fontSize: adjustedSize(12),
    lineHeight: adjustedSize(12) * NATIVE_LINE_HEIGHT_SCALE,
    fontWeight: MEDIUM_WEIGHT,
    maxFontSizeMultiplier: 1.2
  },
  monospace: {
    family: platformFontFamily("monospace"),
    fontSize: adjustedSize(12),
    lineHeight: 16,
    maxFontSizeMultiplier: 1.2
  }
};
var face = {
  [defaultWeights.book]: { normal: baselBook },
  [defaultWeights.medium]: { normal: baselMedium }
};
var headingFont = (0, import_core2.createFont)({
  family: baselBook,
  ...import_core2.isAndroid ? { face } : null,
  size: {
    small: fonts.heading3.fontSize,
    medium: fonts.heading2.fontSize,
    true: fonts.heading2.fontSize,
    large: fonts.heading1.fontSize
  },
  weight: defaultWeights,
  lineHeight: {
    small: fonts.heading3.lineHeight,
    medium: fonts.heading2.lineHeight,
    true: fonts.heading2.lineHeight,
    large: fonts.heading1.lineHeight
  }
});
var subHeadingFont = (0, import_core2.createFont)({
  family: baselBook,
  ...import_core2.isAndroid ? { face } : null,
  size: {
    small: fonts.subheading2.fontSize,
    large: fonts.subheading1.fontSize,
    true: fonts.subheading1.fontSize
  },
  weight: defaultWeights,
  lineHeight: {
    small: fonts.subheading2.lineHeight,
    large: fonts.subheading1.lineHeight,
    true: fonts.subheading1.lineHeight
  }
});
var bodyFont = (0, import_core2.createFont)({
  family: baselBook,
  ...import_core2.isAndroid ? { face } : null,
  size: {
    micro: fonts.body4.fontSize,
    small: fonts.body3.fontSize,
    medium: fonts.body2.fontSize,
    true: fonts.body2.fontSize,
    large: fonts.body1.fontSize
  },
  weight: defaultWeights,
  lineHeight: {
    micro: fonts.body4.lineHeight,
    small: fonts.body3.lineHeight,
    medium: fonts.body2.lineHeight,
    true: fonts.body2.lineHeight,
    large: fonts.body1.lineHeight
  }
});
var buttonFont = (0, import_core2.createFont)({
  family: baselMedium,
  size: {
    micro: fonts.buttonLabel4.fontSize,
    small: fonts.buttonLabel3.fontSize,
    medium: fonts.buttonLabel2.fontSize,
    large: fonts.buttonLabel1.fontSize,
    true: fonts.buttonLabel2.fontSize
  },
  weight: {
    ...defaultWeights,
    true: MEDIUM_WEIGHT
  },
  lineHeight: {
    micro: fonts.buttonLabel4.lineHeight,
    small: fonts.buttonLabel3.lineHeight,
    medium: fonts.buttonLabel2.lineHeight,
    large: fonts.buttonLabel1.lineHeight,
    true: fonts.buttonLabel2.lineHeight
  }
});
var monospaceFont = (0, import_core2.createFont)({
  family: monospaceFontFamily,
  size: {
    micro: fonts.body4.fontSize,
    small: fonts.body3.fontSize,
    medium: fonts.body2.fontSize,
    large: fonts.body1.fontSize,
    true: fonts.body4.fontSize
  },
  weight: defaultWeights,
  lineHeight: {
    micro: fonts.body4.lineHeight,
    small: fonts.body3.lineHeight,
    medium: fonts.body2.lineHeight,
    large: fonts.body1.lineHeight,
    true: fonts.body4.lineHeight
  }
});
var allFonts = {
  heading: headingFont,
  subHeading: subHeadingFont,
  body: bodyFont,
  button: buttonFont,
  monospace: monospaceFont
};

// ../../packages/ui/src/theme/borderRadii.ts
var borderRadii = {
  none: 0,
  rounded4: 4,
  rounded6: 6,
  rounded8: 8,
  rounded12: 12,
  rounded16: 16,
  rounded20: 20,
  rounded24: 24,
  rounded32: 32,
  roundedFull: 999999
};

// ../../packages/ui/src/theme/breakpoints.ts
var breakpoints = {
  xxs: 360,
  xs: 380,
  sm: 450,
  md: 640,
  lg: 768,
  xl: 1024,
  xxl: 1280,
  xxxl: 1536
};
var heightBreakpoints = {
  short: 736,
  midHeight: 800,
  lgHeight: 960
};

// ../../packages/utilities/src/errors/index.ts
var PlatformSplitStubError = class extends Error {
  static {
    __name(this, "PlatformSplitStubError");
  }
  constructor(functionName) {
    super(`${functionName} not implemented. Did you forget a platform override?`);
    this.name = this.constructor.name;
  }
};

// ../../packages/utilities/src/environment/env.ts
function checkWindowForPlaywright() {
  return typeof window === "undefined";
}
__name(checkWindowForPlaywright, "checkWindowForPlaywright");
function isDevEnv() {
  if (checkWindowForPlaywright()) {
    return false;
  }
  throw new PlatformSplitStubError("isDevEnv");
}
__name(isDevEnv, "isDevEnv");
function isRNDev() {
  if (checkWindowForPlaywright()) {
    return false;
  }
  throw new PlatformSplitStubError("isRNDev");
}
__name(isRNDev, "isRNDev");

// ../../packages/utilities/src/environment/constants.ts
var isVitestRun = !!process.env.VITEST_POOL_ID;
var isTestRun = !!process.env.JEST_WORKER_ID || !!process.env.VITEST_POOL_ID;
var isNonTestDev = !isVitestRun && !isTestRun && (isMobileApp ? isRNDev() : isDevEnv());
var localDevDatadogEnabled = false;
var datadogEnabledBuild = (localDevDatadogEnabled || !isRNDev()) && !isTestRun && !isVitestRun;

// ../../packages/utilities/src/logger/datadog/Datadog.ts
function logToDatadog(_message, _options) {
  throw new PlatformSplitStubError("logToDatadog");
}
__name(logToDatadog, "logToDatadog");
function logWarningToDatadog(_message, _options) {
  throw new PlatformSplitStubError("logWarningToDatadog");
}
__name(logWarningToDatadog, "logWarningToDatadog");
function logErrorToDatadog(_error, _context) {
  throw new PlatformSplitStubError("logErrorToDatadog");
}
__name(logErrorToDatadog, "logErrorToDatadog");

// ../../packages/utilities/src/logger/logger.ts
var MAX_CHAR_LIMIT = 8192;
var datadogEnabled = false;
var logger = {
  debug: /* @__PURE__ */ __name((fileName, functionName, message, ...args) => logMessage("debug", fileName, functionName, message, ...args), "debug"),
  info: /* @__PURE__ */ __name((fileName, functionName, message, ...args) => logMessage("info", fileName, functionName, message, ...args), "info"),
  warn: /* @__PURE__ */ __name((fileName, functionName, message, ...args) => logMessage("warn", fileName, functionName, message, ...args), "warn"),
  error: /* @__PURE__ */ __name((error, captureContext) => logException(error, captureContext), "error"),
  setDatadogEnabled: /* @__PURE__ */ __name((enabled) => {
    datadogEnabled = enabled || localDevDatadogEnabled;
  }, "setDatadogEnabled")
};
function logMessage(level, fileName, functionName, message, ...args) {
  if (isWebApp) {
    if (isMobileApp && ["log", "debug", "warn"].includes(level)) {
      console.log(...formatMessage({ level, fileName, functionName, message }), ...args);
    } else {
      console[level](...formatMessage({ level, fileName, functionName, message }), ...args);
    }
  }
  if (!datadogEnabledBuild || !datadogEnabled) {
    return;
  }
  if (level === "warn") {
    logWarningToDatadog(message, {
      level,
      args,
      functionName,
      fileName
    });
  } else if (level === "info") {
    logToDatadog(message, {
      level,
      args,
      functionName,
      fileName
    });
  }
}
__name(logMessage, "logMessage");
function logException(error, captureContext) {
  const updatedContext = addErrorExtras(error, captureContext);
  if (isWebApp) {
    console.error(error, captureContext);
  }
  if (!datadogEnabledBuild || !datadogEnabled) {
    return;
  }
  for (const contextProp of Object.keys(updatedContext.tags)) {
    const prop = contextProp;
    const contextValue = updatedContext.tags[prop];
    if (typeof contextValue === "string") {
      updatedContext.tags[prop] = contextValue.slice(0, MAX_CHAR_LIMIT);
    }
  }
  logErrorToDatadog(error instanceof Error ? error : new Error(`${error}`), updatedContext);
}
__name(logException, "logException");
function addErrorExtras(error, captureContext) {
  if (error instanceof Error) {
    const updatedContext = { ...captureContext };
    const extras = {};
    const { nativeStackAndroid, userInfo } = error;
    if (Array.isArray(nativeStackAndroid) && nativeStackAndroid.length > 0) {
      extras["nativeStackAndroid"] = nativeStackAndroid;
    }
    if (userInfo) {
      extras["userInfo"] = userInfo;
    }
    updatedContext.extra = { ...updatedContext.extra, ...extras };
    return updatedContext;
  }
  return captureContext;
}
__name(addErrorExtras, "addErrorExtras");
function pad(n, amount = 2) {
  return n.toString().padStart(amount, "0");
}
__name(pad, "pad");
function formatMessage({
  level,
  fileName,
  functionName,
  message
}) {
  const t = /* @__PURE__ */ new Date();
  const timeString = `${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}.${pad(t.getMilliseconds(), 3)}`;
  if (isWebPlatform) {
    return [
      level.toUpperCase(),
      {
        context: {
          time: timeString,
          fileName,
          functionName
        }
      },
      message
    ];
  } else {
    return [`${timeString}::${fileName}#${functionName}`, message];
  }
}
__name(formatMessage, "formatMessage");

// ../../packages/ui/src/theme/color/utils.ts
var HEX_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
function opacifyRaw(opacity, color) {
  "worklet";
  try {
    if (opacity < 0 || opacity > 100) {
      throw new Error(`provided opacity ${opacity} should be between 0 and 100`);
    }
    if (color.startsWith("#")) {
      return _opacifyHex(opacity, color);
    }
    if (color.startsWith("rgb(")) {
      return _opacifyRgba(opacity, color);
    }
    throw new Error(`provided color ${color} is neither a hex nor an rgb color`);
  } catch (e) {
    logger.warn("color/utils", "opacifyRaw", `Error opacifying color ${color} with opacity ${opacity}: ${e}`);
  }
  return color;
}
__name(opacifyRaw, "opacifyRaw");
function _opacifyRgba(opacity, color) {
  const match = color.match(/rgba?\(([^)]+)\)/);
  if (!match) {
    throw new Error(`provided color ${color} is invalid rgb format`);
  }
  const parts = match[1]?.split(",").map((p) => p.trim());
  if (!parts || parts.length < 3) {
    throw new Error(`provided color ${color} does not have enough components`);
  }
  const [r, g, b] = parts;
  return `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`;
}
__name(_opacifyRgba, "_opacifyRgba");
function _opacifyHex(opacity, color) {
  if (![5, 7, 9].includes(color.length)) {
    throw new Error(`provided color ${color} was not in hexadecimal format (e.g. #000000)`);
  }
  let hex = color;
  if (color.length === 5) {
    hex = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }
  const validHexColor = HEX_REGEX.test(hex);
  if (!validHexColor) {
    throw new Error(`provided color ${color} contains invalid characters, should be a valid hex (e.g. #000000)`);
  }
  const opacityHex = Math.round(opacity / 100 * 255).toString(16);
  const opacifySuffix = opacityHex.length < 2 ? `0${opacityHex}` : opacityHex;
  return `${hex.slice(0, 7)}${opacifySuffix}`;
}
__name(_opacifyHex, "_opacifyHex");

// ../../packages/ui/src/theme/color/colors.ts
var accentColors = {
  pinkLight: "#FEF4FF",
  pinkPastel: "#FDAFF0",
  pinkBase: "#FC74FE",
  pinkVibrant: "#F50DB4",
  pinkDark: "#361A37",
  redLight: "#FFF2F1",
  redPastel: "#FDCFC4",
  redBase: "#FF5F52",
  redVibrant: "#FF0000",
  redDark: "#220D0C",
  orangeLight: "#FEF5EA",
  orangePastel: "#FFE8BC",
  orangeBase: "#FF8934",
  orangeVibrant: "#FF4D00",
  orangeDark: "#371B0C",
  yellowLight: "#FFFE8B",
  yellowPastel: "#FFF8B4",
  yellowBase: "#FFBF17",
  yellowVibrant: "#FFF612",
  yellowDark: "#1F1E02",
  brownLight: "#F7F6F1",
  brownPastel: "#E2E0CD",
  brownBase: "#85754A",
  brownVibrant: "#996F01",
  brownDark: "#231E0F",
  greenLight: "#EEFBF1",
  greenPastel: "#C2E7D0",
  greenBase: "#0C8911",
  greenVibrant: "#21C95E",
  greenDark: "#0F2C1A",
  limeLight: "#F7FEEB",
  limePastel: "#E4F6C4",
  limeBase: "#78E744",
  limeVibrant: "#B1F13C",
  limeDark: "#232917",
  turquoiseLight: "#F7FEEB",
  turquoisePastel: "#CAFFDF",
  turquoiseBase: "#00C3A0",
  turquoiseVibrant: "#5CFE9D",
  turquoiseDark: "#1A2A21",
  cyanLight: "#EBF8FF",
  cyanPastel: "#B9E3F8",
  cyanBase: "#23A3FF",
  cyanVibrant: "#3ADCFF",
  cyanDark: "#15242B",
  blueLight: "#EFF4FF",
  bluePastel: "#D0D9F8",
  blueBase: "#4981FF",
  blueVibrant: "#0047FF",
  blueDark: "#10143D",
  purpleLight: "#FAF5FF",
  purplePastel: "#E9D8FD",
  purpleBase: "#9E62FF",
  purpleVibrant: "#4300B0",
  purpleDark: "#1A0040"
};
var colors = {
  white: "#FFFFFF",
  black: "#000000",
  scrim: "rgba(0,0,0,0.60)",
  ...accentColors,
  dexViolet: "#4673FA",
  dexPurple: "#7D55FB",
  fiatOnRampBanner: "#9B9B9B"
};
var DEP_accentColors = {
  blue200: "#ADBCFF",
  blue300: "#869EFF",
  blue400: "#4C82FB",
  gold200: "#EEB317",
  goldVibrant: "#FEB239",
  green300: "#40B66B",
  green400: "#209853",
  magenta100: "#FAD8F8",
  magenta50: "#FFF1FE",
  magentaVibrant: "#FC72FF",
  red200: "#FEA79B",
  red300: "#FD766B",
  red400: "#FA2B39",
  violet200: "#BDB8FA",
  violet400: "#7A7BEB",
  yellow100: "#F0E49A",
  yellow200: "#DBBC19"
};
var networkColors = {
  ethereum: {
    light: "#627EEA",
    dark: "#627EEA"
  },
  optimism: {
    light: "#FF0420",
    dark: "#FF0420"
  },
  polygon: {
    light: "#8247E5",
    dark: "#8247E5"
  },
  arbitrum: {
    light: "#12AAFF",
    dark: "#12AAFF"
  },
  bnb: {
    light: "#B08603",
    dark: "#FFBF17"
  },
  base: {
    light: "#0052FF",
    dark: "#0052FF"
  },
  blast: {
    light: "#222222",
    dark: "#FCFC03"
  },
  avalanche: {
    light: "#E84142",
    dark: "#E84142"
  },
  celo: {
    light: "#222222",
    dark: "#FCFF52"
  },
  monad: {
    light: "#735BF8",
    dark: "#836EF9"
  },
  solana: {
    light: "#9945FF",
    dark: "#9945FF"
  },
  soneium: {
    light: "#000000",
    dark: "#FFFFFF"
  },
  xlayer: {
    light: "#A7A7A747",
    dark: "#A7A7A724"
  },
  worldchain: {
    light: "#222222",
    dark: "#FFFFFF"
  },
  unichain: {
    light: "#fc0fa4",
    dark: "#fc0fa4"
  },
  zora: {
    light: "#222222",
    dark: "#FFFFFF"
  },
  zksync: {
    light: "#3667F6",
    dark: "#3667F6"
  },
  lux: {
    light: "#F54562",
    dark: "#F54562"
  },
  zoo: {
    light: "#9945FF",
    dark: "#9945FF"
  }
};
var sporeLight = {
  white: colors.white,
  black: colors.black,
  scrim: colors.scrim,
  neutral1: "#131313",
  neutral1Hovered: "rgba(19, 19, 19, 0.83)",
  neutral2: "rgba(19, 19, 19, 0.63)",
  neutral2Hovered: "rgba(19, 19, 19, 0.83)",
  neutral3: "rgba(19, 19, 19, 0.35)",
  neutral3Hovered: "rgba(19, 19, 19, 0.55)",
  surface1: colors.white,
  surface1Hovered: "#FCFCFC",
  surface2: "#F9F9F9",
  surface2Hovered: "#F2F2F2",
  surface3: "rgba(19, 19, 19, 0.08)",
  surface3Solid: "#F2F2F2",
  surface3Hovered: "rgba(19, 19, 19, 0.1)",
  surface4: "rgba(255, 255, 255, 0.64)",
  surface5: "rgba(0,0,0,0.04)",
  surface5Hovered: "rgba(0,0,0,0.06)",
  accent1: "#000000",
  accent1Hovered: "#1A1A1A",
  accent2: "rgba(0, 0, 0, 0.08)",
  accent2Hovered: "rgba(0, 0, 0, 0.12)",
  accent2Solid: "#F5F5F5",
  accent3: "#222222",
  accent3Hovered: colors.black,
  DEP_accentSoft: "#00000033",
  //33 = 20%
  DEP_blue400: "#4C82FB",
  statusSuccess: "#0C8911",
  statusSuccessHovered: "#06742C",
  statusSuccess2: "rgba(15, 194, 68, 0.06)",
  statusSuccess2Hovered: "rgba(15, 194, 68, 0.12)",
  statusWarning: "#996F01",
  statusWarningHovered: "#7A5801",
  statusWarning2: "rgba(255, 191, 23, 0.1)",
  statusWarning2Hovered: "rgba(255, 191, 23, 0.1)",
  statusCritical: "#E10F0F",
  statusCriticalHovered: "#BF0D0D",
  statusCritical2: "rgba(255, 0, 0, 0.05)",
  statusCritical2Hovered: "rgba(255, 0, 0, 0.1)"
};
var sporeDark = {
  none: "transparent",
  white: colors.white,
  black: colors.black,
  scrim: colors.scrim,
  neutral1: colors.white,
  neutral1Hovered: "rgba(255, 255, 255, 0.85)",
  neutral2: "rgba(255, 255, 255, 0.65)",
  neutral2Hovered: "rgba(255, 255, 255, 0.85)",
  neutral3: "rgba(255, 255, 255, 0.38)",
  neutral3Hovered: "rgba(255, 255, 255, 0.58)",
  surface1: "#000000",
  surface1Hovered: "#0A0A0A",
  surface2: "#0F0F0F",
  surface2Hovered: "#141414",
  surface3: "rgba(255,255,255,0.10)",
  surface3Solid: "#1A1A1A",
  surface3Hovered: "rgba(255,255,255,0.14)",
  surface4: "rgba(255,255,255,0.16)",
  surface5: "rgba(0,0,0,0.04)",
  surface5Hovered: "rgba(0,0,0,0.06)",
  accent1: "#FFFFFF",
  accent1Hovered: "#E0E0E0",
  accent2: "rgba(255, 255, 255, 0.08)",
  accent2Hovered: "rgba(255, 255, 255, 0.12)",
  accent2Solid: "#1A1A1A",
  accent3: colors.white,
  accent3Hovered: "#F5F5F5",
  DEP_accentSoft: "#FFFFFF33",
  //33 = 20%
  DEP_blue400: "#4C82FB",
  statusSuccess: "#21C95E",
  statusSuccessHovered: "#15863C",
  statusSuccess2: "rgba(33, 201, 94, 0.12)",
  statusSuccess2Hovered: "#093A16",
  statusWarning: "#FFBF17",
  statusWarningHovered: "#FFDD0D",
  statusWarning2: "rgba(255, 191, 23, 0.08)",
  statusWarning2Hovered: "rgba(255, 191, 23, 0.16)",
  statusCritical: "#FF593C",
  statusCriticalHovered: "#FF401F",
  statusCritical2: "rgba(255, 89, 60, 0.12)",
  statusCritical2Hovered: "rgba(255, 89, 60, 0.2)"
};
var colorsLight = {
  none: "transparent",
  white: sporeLight.white,
  black: sporeLight.black,
  scrim: sporeLight.scrim,
  neutral1: sporeLight.neutral1,
  neutral1Hovered: sporeLight.neutral1Hovered,
  neutral2: sporeLight.neutral2,
  neutral2Hovered: sporeLight.neutral2Hovered,
  neutral3: sporeLight.neutral3,
  neutral3Hovered: sporeLight.neutral3Hovered,
  surface1: sporeLight.surface1,
  surface1Hovered: sporeLight.surface1Hovered,
  surface2: sporeLight.surface2,
  surface2Hovered: sporeLight.surface2Hovered,
  surface3: sporeLight.surface3,
  surface3Solid: sporeLight.surface3Solid,
  surface3Hovered: sporeLight.surface3Hovered,
  surface4: sporeLight.surface4,
  surface5: sporeLight.surface5,
  surface5Hovered: sporeLight.surface5Hovered,
  accent1: sporeLight.accent1,
  accent1Hovered: sporeLight.accent1Hovered,
  accent2: sporeLight.accent2,
  accent2Solid: sporeLight.accent2Solid,
  accent2Hovered: sporeLight.accent2Hovered,
  accent3: sporeLight.accent3,
  accent3Hovered: sporeLight.accent3Hovered,
  DEP_accentSoft: sporeLight.DEP_accentSoft,
  DEP_blue400: sporeLight.DEP_blue400,
  statusSuccess: sporeLight.statusSuccess,
  statusSuccessHovered: sporeLight.statusSuccessHovered,
  statusSuccess2: sporeLight.statusSuccess2,
  statusSuccess2Hovered: sporeLight.statusSuccess2Hovered,
  statusCritical: sporeLight.statusCritical,
  statusCriticalHovered: sporeLight.statusCriticalHovered,
  statusCritical2: sporeLight.statusCritical2,
  statusCritical2Hovered: sporeLight.statusCritical2Hovered,
  statusWarning: sporeLight.statusWarning,
  statusWarningHovered: sporeLight.statusWarningHovered,
  statusWarning2: sporeLight.statusWarning2,
  statusWarning2Hovered: sporeLight.statusWarning2Hovered,
  DEP_backgroundBranded: "#FCF7FF",
  DEP_backgroundOverlay: opacifyRaw(60, colors.white),
  DEP_accentBranded: DEP_accentColors.magentaVibrant,
  DEP_shadowBranded: DEP_accentColors.magentaVibrant,
  DEP_brandedAccentSoft: DEP_accentColors.magenta100,
  DEP_magentaDark: opacifyRaw(12, DEP_accentColors.magentaVibrant),
  DEP_fiatBanner: colors.fiatOnRampBanner,
  chain_1: sporeLight.neutral1,
  chain_130: networkColors.unichain.light,
  chain_10: networkColors.optimism.light,
  chain_137: networkColors.polygon.light,
  chain_42161: networkColors.arbitrum.light,
  chain_80001: networkColors.polygon.light,
  chain_8453: networkColors.base.light,
  chain_7777777: networkColors.zora.light,
  chain_81457: networkColors.blast.light,
  chain_56: networkColors.bnb.light,
  chain_42220: networkColors.celo.light,
  chain_43114: networkColors.avalanche.light,
  chain_324: networkColors.zksync.light,
  chain_480: networkColors.worldchain.light,
  chain_1868: networkColors.soneium.light,
  chain_196: networkColors.xlayer.light,
  chain_501000101: networkColors.solana.light,
  chain_143: networkColors.monad.light,
  // Lux ecosystem
  chain_96369: networkColors.lux.light,
  chain_200200: networkColors.zoo.light,
  // Testnets
  chain_11155111: networkColors.ethereum.light,
  chain_1301: networkColors.unichain.light,
  chain_10143: networkColors.monad.light,
  chain_96368: networkColors.lux.light,
  chain_200201: networkColors.zoo.light,
  chain_1337: networkColors.lux.light,
  // Lux Local dev mode
  pinkThemed: colors.pinkLight
};
var colorsDark = {
  none: "transparent",
  white: sporeDark.white,
  black: sporeDark.black,
  surface1: sporeDark.surface1,
  surface1Hovered: sporeDark.surface1Hovered,
  surface2: sporeDark.surface2,
  surface2Hovered: sporeDark.surface2Hovered,
  surface3: sporeDark.surface3,
  surface3Solid: sporeDark.surface3Solid,
  surface3Hovered: sporeDark.surface3Hovered,
  surface4: sporeDark.surface4,
  surface5: sporeDark.surface5,
  surface5Hovered: sporeDark.surface5Hovered,
  scrim: sporeDark.scrim,
  neutral1: sporeDark.neutral1,
  neutral1Hovered: sporeDark.neutral1Hovered,
  neutral2: sporeDark.neutral2,
  neutral2Hovered: sporeDark.neutral2Hovered,
  neutral3: sporeDark.neutral3,
  neutral3Hovered: sporeDark.neutral3Hovered,
  accent1: sporeDark.accent1,
  accent1Hovered: sporeDark.accent1Hovered,
  accent2: sporeDark.accent2,
  accent2Solid: sporeDark.accent2Solid,
  accent2Hovered: sporeDark.accent2Hovered,
  accent3: sporeDark.accent3,
  accent3Hovered: sporeDark.accent3Hovered,
  DEP_accentSoft: sporeDark.DEP_accentSoft,
  DEP_blue400: sporeDark.DEP_blue400,
  statusSuccess: sporeDark.statusSuccess,
  statusSuccessHovered: sporeDark.statusSuccessHovered,
  statusSuccess2: sporeDark.statusSuccess2,
  statusSuccess2Hovered: sporeDark.statusSuccess2Hovered,
  statusCritical: sporeDark.statusCritical,
  statusCriticalHovered: sporeDark.statusCriticalHovered,
  statusCritical2: sporeDark.statusCritical2,
  statusCritical2Hovered: sporeDark.statusCritical2Hovered,
  statusWarning: sporeDark.statusWarning,
  statusWarningHovered: sporeDark.statusWarningHovered,
  statusWarning2: sporeDark.statusWarning2,
  statusWarning2Hovered: sporeDark.statusWarning2Hovered,
  DEP_backgroundBranded: "#100D1C",
  DEP_backgroundOverlay: opacifyRaw(10, colors.white),
  DEP_accentBranded: DEP_accentColors.magentaVibrant,
  // TODO(MOB-160): accommodate one-off color in cleaner way
  DEP_shadowBranded: "#B60ACF",
  DEP_brandedAccentSoft: "#46244F",
  // git blame Chelsy
  DEP_magentaDark: opacifyRaw(12, DEP_accentColors.magentaVibrant),
  DEP_fiatBanner: colors.fiatOnRampBanner,
  chain_1: sporeDark.neutral1,
  chain_130: networkColors.unichain.dark,
  chain_10: networkColors.optimism.dark,
  chain_137: networkColors.polygon.dark,
  chain_42161: networkColors.arbitrum.dark,
  chain_80001: networkColors.polygon.dark,
  chain_8453: networkColors.base.dark,
  chain_7777777: networkColors.zora.dark,
  chain_81457: networkColors.blast.dark,
  chain_56: networkColors.bnb.dark,
  chain_42220: networkColors.celo.dark,
  chain_43114: networkColors.avalanche.dark,
  chain_324: networkColors.zksync.dark,
  chain_480: networkColors.worldchain.dark,
  chain_1868: networkColors.soneium.dark,
  chain_196: networkColors.xlayer.dark,
  chain_501000101: networkColors.solana.dark,
  chain_143: networkColors.monad.dark,
  // Lux ecosystem
  chain_96369: networkColors.lux.dark,
  chain_200200: networkColors.zoo.dark,
  // Testnets
  chain_11155111: networkColors.ethereum.dark,
  chain_1301: networkColors.unichain.dark,
  chain_10143: networkColors.monad.dark,
  chain_96368: networkColors.lux.dark,
  chain_200201: networkColors.zoo.dark,
  chain_1337: networkColors.lux.dark,
  // Lux Local dev mode
  pinkThemed: colors.pinkDark
};

// ../../packages/ui/src/theme/iconSizes.ts
var iconSizes = {
  icon8: 8,
  icon12: 12,
  icon16: 16,
  icon18: 18,
  icon20: 20,
  icon24: 24,
  icon28: 28,
  icon32: 32,
  icon36: 36,
  icon40: 40,
  icon44: 44,
  icon48: 48,
  icon56: 56,
  icon64: 64,
  icon70: 70,
  icon100: 100
};

// ../../packages/ui/src/theme/imageSizes.ts
var imageSizes = {
  image12: 12,
  image16: 16,
  image20: 20,
  image24: 24,
  image32: 32,
  image36: 36,
  image40: 40,
  image48: 48,
  image64: 64,
  image100: 100
};

// ../../packages/ui/src/theme/spacing.ts
var spacing = {
  none: 0,
  spacing1: 1,
  spacing2: 2,
  spacing4: 4,
  spacing6: 6,
  spacing8: 8,
  spacing12: 12,
  spacing16: 16,
  spacing18: 18,
  spacing20: 20,
  spacing24: 24,
  spacing28: 28,
  spacing32: 32,
  spacing36: 36,
  spacing40: 40,
  spacing48: 48,
  spacing60: 60
};
var padding = {
  padding6: spacing.spacing6,
  padding8: spacing.spacing8,
  padding12: spacing.spacing12,
  padding16: spacing.spacing16,
  padding20: spacing.spacing20,
  padding36: spacing.spacing36
};
var gap = {
  gap4: spacing.spacing4,
  gap8: spacing.spacing8,
  gap12: spacing.spacing12,
  gap16: spacing.spacing16,
  gap20: spacing.spacing20,
  gap24: spacing.spacing24,
  gap32: spacing.spacing32,
  gap36: spacing.spacing36
};

// ../../packages/ui/src/theme/themes.ts
var { none: darkTransparent, ...tamaguiColorsDark } = colorsDark;
var { none: lightTransparent, ...tamaguiColorsLight } = colorsLight;
var light = {
  // Lux Design System
  ...tamaguiColorsLight,
  transparent: lightTransparent,
  // Tamagui Theme
  // Tamagui components expect the following
  background: colorsLight.surface1,
  backgroundHover: colorsLight.surface2,
  backgroundPress: colorsLight.surface2,
  backgroundFocus: colorsLight.surface2,
  borderColor: colorsLight.none,
  borderColorHover: colorsLight.none,
  borderColorFocus: colorsLight.none,
  outlineColor: colorsLight.none,
  color: colorsLight.neutral1,
  colorHover: colorsLight.accent1,
  colorPress: colorsLight.accent1,
  colorFocus: colorsLight.accent1,
  shadowColor: "rgba(0,0,0,0.15)",
  shadowColorHover: "rgba(0,0,0,0.2)"
};
var dark = {
  ...tamaguiColorsDark,
  transparent: darkTransparent,
  background: colorsDark.surface1,
  backgroundHover: colorsDark.surface2,
  backgroundPress: colorsDark.surface2,
  backgroundFocus: colorsDark.surface2,
  borderColor: colorsDark.none,
  borderColorHover: colorsDark.none,
  borderColorFocus: colorsDark.none,
  outlineColor: colorsDark.none,
  color: colorsDark.neutral1,
  colorHover: colorsDark.accent1,
  colorPress: colorsDark.accent1,
  colorFocus: colorsDark.accent1,
  shadowColor: "rgba(0,0,0,0.4)",
  shadowColorHover: "rgba(0,0,0,0.5)"
};
var allThemes = {
  dark,
  light
};
var themes = allThemes;

// ../../packages/ui/src/theme/tokens.ts
var import_core3 = require("@tamagui/core");

// ../../packages/ui/src/theme/zIndexes.ts
var zIndexes = {
  negative: -1,
  background: 0,
  default: 1,
  mask: 10,
  dropdown: 970,
  header: 980,
  sidebar: 990,
  // Note: tamagui dialog portal defaults to 1000. any z-index >= 1000 will appear above this portal
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  offcanvas: 1050,
  modal: 1060,
  popoverBackdrop: 1065,
  popover: 1070,
  tooltip: 1080,
  // Custom value needed to properly display components
  // above modals (e.g. in the extension app)
  overlay: 100010,
  // Toast notifications should appear above all other content
  toast: 100020
};

// ../../packages/ui/src/theme/tokens.ts
var space = { ...spacing, ...padding, ...gap, true: spacing.spacing8 };
var size = space;
var iconSize = {
  true: iconSizes.icon40,
  8: iconSizes.icon8,
  12: iconSizes.icon12,
  16: iconSizes.icon16,
  18: iconSizes.icon18,
  20: iconSizes.icon20,
  24: iconSizes.icon24,
  28: iconSizes.icon28,
  32: iconSizes.icon32,
  36: iconSizes.icon36,
  40: iconSizes.icon40,
  48: iconSizes.icon48,
  64: iconSizes.icon64,
  70: iconSizes.icon70,
  100: iconSizes.icon100
};
var fontSize = {
  heading1: fonts.heading1.fontSize,
  heading2: fonts.heading2.fontSize,
  heading3: fonts.heading3.fontSize,
  subheading1: fonts.subheading1.fontSize,
  subheading2: fonts.subheading2.fontSize,
  body1: fonts.body1.fontSize,
  body2: fonts.body2.fontSize,
  body3: fonts.body3.fontSize,
  buttonLabel1: fonts.buttonLabel1.fontSize,
  buttonLabel2: fonts.buttonLabel2.fontSize,
  buttonLabel3: fonts.buttonLabel3.fontSize,
  buttonLabel4: fonts.buttonLabel4.fontSize,
  monospace: fonts.monospace.fontSize,
  true: fonts.body2.fontSize
};
var radius = { ...borderRadii, true: borderRadii.none };
var zIndex = { ...zIndexes, true: zIndexes.default };
var imageSize = { ...imageSizes, true: imageSizes.image40 };
var tokens = (0, import_core3.createTokens)({
  color: colors,
  space,
  size,
  font: fontSize,
  icon: iconSize,
  image: imageSize,
  zIndex,
  radius
});

// ../../packages/ui/src/theme/media.ts
var media = createMedia({
  // the order here is important: least strong to most
  xxxl: { maxWidth: breakpoints.xxxl },
  xxl: { maxWidth: breakpoints.xxl },
  xl: { maxWidth: breakpoints.xl },
  lg: { maxWidth: breakpoints.lg },
  md: { maxWidth: breakpoints.md },
  sm: { maxWidth: breakpoints.sm },
  xs: { maxWidth: breakpoints.xs },
  xxs: { maxWidth: breakpoints.xxs },
  short: { maxHeight: heightBreakpoints.short },
  midHeight: { maxHeight: heightBreakpoints.midHeight },
  lgHeight: { maxHeight: heightBreakpoints.lgHeight }
});

// ../../packages/ui/src/theme/shorthands.ts
var shorthands = {
  m: "margin",
  mb: "marginBottom",
  ml: "marginLeft",
  mr: "marginRight",
  mt: "marginTop",
  mx: "marginHorizontal",
  my: "marginVertical",
  p: "padding",
  pb: "paddingBottom",
  pl: "paddingLeft",
  pr: "paddingRight",
  pt: "paddingTop",
  px: "paddingHorizontal",
  py: "paddingVertical"
};

// ../../packages/ui/src/theme/config.ts
var configWithoutAnimations = {
  shorthands,
  fonts: allFonts,
  themes,
  tokens,
  media,
  settings: {
    shouldAddPrefersColorThemes: true,
    themeClassNameOnRoot: true,
    disableSSR: true,
    onlyAllowShorthands: false,
    allowedStyleValues: false,
    autocompleteSpecificTokens: "except-special",
    fastSchemeChange: true
  }
};

// ../../packages/ui/src/tamagui.config.ts
var config = createTamagui({
  animations,
  ...configWithoutAnimations
});
var tamagui_config_default = config;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  config
});
