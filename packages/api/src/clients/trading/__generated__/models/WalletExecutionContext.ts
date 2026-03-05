/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ScopeData } from './ScopeData';
import type { WalletProperties } from './WalletProperties';
/**
 * Wallet execution context based on CAIP-25 Standard. Provides information about wallet capabilities and scopes.
 */
export type WalletExecutionContext = {
    /**
     * Map of scope identifiers to their scope data.
     */
    scopes: Record<string, ScopeData>;
    properties?: WalletProperties;
};

