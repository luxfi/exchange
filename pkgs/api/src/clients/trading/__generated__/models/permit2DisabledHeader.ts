/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Disables the Permit2 approval flow. When set to `true`, `permitData` is returned as `null` and the header is forwarded to the routing layer for correct gas simulation against the Proxy Universal Router contract. When `false` or omitted, the standard Permit2 approval flow is used. This header is intended for integrators whose infrastructure uses a direct approval-then-swap pattern without Permit2.
 */
export type permit2DisabledHeader = boolean;
