import React, { PropsWithChildren } from 'react';

interface AnalyticsConfig {
    /** Proxy URL for analytics endpoint */
    proxyUrl?: string;
    /** Whether this is a production environment */
    isProductionEnv?: boolean;
    /** Enable debug logging */
    debug?: boolean;
    /** Report user's country */
    reportOriginCountry?: boolean;
}
declare enum OriginApplication {
    INTERFACE = "interface",
    MOBILE = "mobile",
    EXTENSION = "extension"
}
declare const ANONYMOUS_DEVICE_ID = "00000000-0000-0000-0000-000000000000";
declare let analyticsConfig: AnalyticsConfig | undefined;
/**
 * Initializes analytics with API key.
 *
 * @param apiKey API key for analytics service
 * @param originApplication Name of the application
 * @param config Configuration options
 */
declare function initializeAnalytics(apiKey: string, originApplication: OriginApplication, config?: AnalyticsConfig): void;
/** Sends an event to analytics. */
declare function sendAnalyticsEvent(eventName: string, eventProperties?: Record<string, unknown>): void;
declare function getDeviceId(): string | undefined;
declare function getUserId(): string | undefined;
declare function getSessionId(): number | undefined;
/**
 * Class that exposes methods to mutate the User Model's properties
 * that represents the current session's user.
 */
declare class UserModel {
    private log;
    private call;
    set(key: string, value: string | number | boolean | string[]): void;
    setOnce(key: string, value: string | number | boolean | string[]): void;
    add(key: string, value: number): void;
    postInsert(key: string, value: string | number): void;
    remove(key: string, value: string | number): void;
}
declare const user: UserModel;

interface ITraceContext {
    page?: string;
    section?: string;
    element?: string;
    modal?: string;
}

declare const TraceContext: React.Context<ITraceContext>;
declare function useTrace(): ITraceContext;
type TraceProps = {
    page?: string;
    section?: string;
    element?: string;
    properties?: Record<string, unknown>;
    logImpression?: boolean;
} & ITraceContext;
/**
 * Trace component that provides analytics context to children.
 * Optionally logs an impression event when mounted.
 */
declare function TraceComponent({ children, page, section, element, properties, logImpression, ...parentContext }: PropsWithChildren<TraceProps>): React.JSX.Element;
declare const Trace: React.MemoExoticComponent<typeof TraceComponent>;

type TraceEventProps = {
    events: (keyof GlobalEventHandlersEventMap)[];
    name: string;
    properties?: Record<string, unknown>;
    element?: string;
    shouldLogImpression?: boolean;
};
/**
 * TraceEvent component that wraps children and sends analytics events on specified DOM events.
 */
declare function TraceEventComponent({ children, events, name, properties, element, }: PropsWithChildren<TraceEventProps>): React.JSX.Element;
declare const TraceEvent: React.MemoExoticComponent<typeof TraceEventComponent>;

export { ANONYMOUS_DEVICE_ID, type AnalyticsConfig, type ITraceContext, OriginApplication, Trace, TraceContext, TraceEvent, analyticsConfig, getDeviceId, getSessionId, getUserId, initializeAnalytics, sendAnalyticsEvent, useTrace, user };
