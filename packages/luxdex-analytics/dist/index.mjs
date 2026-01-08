// src/analytics.ts
import {
  init,
  track,
  identify,
  Identify,
  getDeviceId as amplitudeGetDeviceId,
  getUserId as amplitudeGetUserId,
  getSessionId as amplitudeGetSessionId
} from "@amplitude/analytics-browser";
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
  init(
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
  track(eventName, { ...eventProperties, origin });
}
function getDeviceId() {
  return amplitudeGetDeviceId();
}
function getUserId() {
  return amplitudeGetUserId();
}
function getSessionId() {
  return amplitudeGetSessionId();
}
var UserModel = class {
  log(method, ...parameters) {
    console.debug(`[analytics(Identify)]: ${method}(${parameters})`);
  }
  call(mutate) {
    if (!analyticsConfig?.isProductionEnv) {
      const log = (_, method) => this.log.bind(this, method);
      mutate(new Proxy(new Identify(), { get: log }));
      return;
    }
    identify(mutate(new Identify()));
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
import { createContext, memo, useContext, useEffect, useMemo } from "react";
import { jsx } from "react/jsx-runtime";
var TraceContext = createContext({});
function useTrace() {
  return useContext(TraceContext);
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
  const combinedContext = useMemo(
    () => ({
      ...parentTrace,
      ...parentContext,
      page: page ?? parentTrace.page,
      section: section ?? parentTrace.section,
      element: element ?? parentTrace.element
    }),
    [parentTrace, parentContext, page, section, element]
  );
  useEffect(() => {
    if (logImpression) {
      sendAnalyticsEvent("Impression", {
        ...combinedContext,
        ...properties
      });
    }
  }, [logImpression, combinedContext, properties]);
  return /* @__PURE__ */ jsx(TraceContext.Provider, { value: combinedContext, children });
}
var Trace = memo(TraceComponent);

// src/TraceEvent.tsx
import {
  Children,
  cloneElement,
  isValidElement,
  memo as memo2,
  useCallback
} from "react";
import { Fragment, jsx as jsx2 } from "react/jsx-runtime";
function TraceEventComponent({
  children,
  events,
  name,
  properties,
  element
}) {
  const parentTrace = useTrace();
  const handleEvent = useCallback(
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
  const child = Children.only(children);
  if (!isValidElement(child)) {
    return /* @__PURE__ */ jsx2(Fragment, { children });
  }
  const childProps = child.props;
  const eventHandlers = {};
  events.forEach((eventType) => {
    const handlerName = `on${eventType.charAt(0).toUpperCase()}${eventType.slice(1)}`;
    const originalHandler = childProps[handlerName];
    eventHandlers[handlerName] = handleEvent(eventType, originalHandler);
  });
  return cloneElement(child, eventHandlers);
}
var TraceEvent = memo2(TraceEventComponent);
export {
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
};
//# sourceMappingURL=index.mjs.map