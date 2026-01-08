"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ANONYMOUS_DEVICE_ID: () => ANONYMOUS_DEVICE_ID,
  OriginApplication: () => OriginApplication,
  Trace: () => Trace,
  TraceContext: () => TraceContext,
  TraceEvent: () => TraceEvent,
  analyticsConfig: () => analyticsConfig,
  getDeviceId: () => getDeviceId,
  getSessionId: () => getSessionId,
  getUserId: () => getUserId,
  initializeAnalytics: () => initializeAnalytics,
  sendAnalyticsEvent: () => sendAnalyticsEvent,
  useTrace: () => useTrace,
  user: () => user
});
module.exports = __toCommonJS(index_exports);

// src/analytics.ts
var import_analytics_browser = require("@amplitude/analytics-browser");
var OriginApplication = /* @__PURE__ */ ((OriginApplication2) => {
  OriginApplication2["INTERFACE"] = "interface";
  OriginApplication2["MOBILE"] = "mobile";
  OriginApplication2["EXTENSION"] = "extension";
  return OriginApplication2;
})(OriginApplication || {});
var ANONYMOUS_DEVICE_ID = "00000000-0000-0000-0000-000000000000";
var isInitialized = false;
var analyticsConfig;
function initializeAnalytics(apiKey, originApplication, config) {
  if (!config?.isProductionEnv && isInitialized) {
    return;
  }
  if (config?.isProductionEnv) {
    if (isInitialized) {
      throw new Error("initializeAnalytics called multiple times. Ensure it is outside of a React component.");
    }
    if (config.debug) {
      throw new Error(
        `It looks like you're trying to initialize analytics in debug mode for production. Disable debug mode or use a non-production environment.`
      );
    }
  }
  isInitialized = true;
  analyticsConfig = config;
  (0, import_analytics_browser.init)(
    apiKey,
    /* userId= */
    void 0,
    // User ID should be undefined to let Amplitude default to Device ID
    /* options= */
    {
      // Configure the SDK to work with alternate endpoint
      serverUrl: config?.proxyUrl,
      // Disable tracking of private user information
      defaultTracking: false
    }
  );
}
function sendAnalyticsEvent(eventName, eventProperties) {
  const origin = typeof window !== "undefined" ? window.location.origin : "unknown";
  if (analyticsConfig?.debug) {
    console.debug({
      eventName,
      eventProperties: { ...eventProperties, origin }
    });
  }
  (0, import_analytics_browser.track)(eventName, { ...eventProperties, origin });
}
function getDeviceId() {
  return (0, import_analytics_browser.getDeviceId)();
}
function getUserId() {
  return (0, import_analytics_browser.getUserId)();
}
function getSessionId() {
  return (0, import_analytics_browser.getSessionId)();
}
var UserModel = class {
  log(method, ...parameters) {
    console.debug(`[analytics(Identify)]: ${method}(${parameters})`);
  }
  call(mutate) {
    if (!analyticsConfig?.isProductionEnv) {
      const log = (_, method) => this.log.bind(this, method);
      mutate(new Proxy(new import_analytics_browser.Identify(), { get: log }));
      return;
    }
    (0, import_analytics_browser.identify)(mutate(new import_analytics_browser.Identify()));
  }
  set(key, value) {
    this.call((event) => event.set(key, value));
  }
  setOnce(key, value) {
    this.call((event) => event.setOnce(key, value));
  }
  add(key, value) {
    this.call((event) => event.add(key, value));
  }
  postInsert(key, value) {
    this.call((event) => event.postInsert(key, value));
  }
  remove(key, value) {
    this.call((event) => event.remove(key, value));
  }
};
var user = new UserModel();

// src/Trace.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var TraceContext = (0, import_react.createContext)({});
function useTrace() {
  return (0, import_react.useContext)(TraceContext);
}
function TraceComponent({
  children,
  page,
  section,
  element,
  properties,
  logImpression,
  ...parentContext
}) {
  const parentTrace = useTrace();
  const combinedContext = (0, import_react.useMemo)(
    () => ({
      ...parentTrace,
      ...parentContext,
      page: page ?? parentTrace.page,
      section: section ?? parentTrace.section,
      element: element ?? parentTrace.element
    }),
    [parentTrace, parentContext, page, section, element]
  );
  (0, import_react.useEffect)(() => {
    if (logImpression) {
      sendAnalyticsEvent("Impression", {
        ...combinedContext,
        ...properties
      });
    }
  }, [logImpression, combinedContext, properties]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraceContext.Provider, { value: combinedContext, children });
}
var Trace = (0, import_react.memo)(TraceComponent);

// src/TraceEvent.tsx
var import_react2 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
function TraceEventComponent({
  children,
  events,
  name,
  properties,
  element
}) {
  const parentTrace = useTrace();
  const handleEvent = (0, import_react2.useCallback)(
    (eventType, originalHandler) => (e) => {
      sendAnalyticsEvent(name, {
        ...parentTrace,
        element,
        eventType,
        ...properties
      });
      originalHandler?.(e);
    },
    [name, parentTrace, element, properties]
  );
  const child = import_react2.Children.only(children);
  if (!(0, import_react2.isValidElement)(child)) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, { children });
  }
  const childProps = child.props;
  const eventHandlers = {};
  events.forEach((eventType) => {
    const handlerName = `on${eventType.charAt(0).toUpperCase()}${eventType.slice(1)}`;
    const originalHandler = childProps[handlerName];
    eventHandlers[handlerName] = handleEvent(eventType, originalHandler);
  });
  return (0, import_react2.cloneElement)(child, eventHandlers);
}
var TraceEvent = (0, import_react2.memo)(TraceEventComponent);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ANONYMOUS_DEVICE_ID,
  OriginApplication,
  Trace,
  TraceContext,
  TraceEvent,
  analyticsConfig,
  getDeviceId,
  getSessionId,
  getUserId,
  initializeAnalytics,
  sendAnalyticsEvent,
  useTrace,
  user
});
//# sourceMappingURL=index.js.map