/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientContext } from './ClientContext';
/**
 * Data defining a wallet scope including accounts, methods, capabilities, chains, and client context.
 */
export type ScopeData = {
    /**
     * Array of account addresses associated with this scope.
     */
    accounts: Array<string>;
    /**
     * Array of methods allowed in this scope.
     */
    methods: Array<string>;
    /**
     * Additional capabilities for this scope.
     */
    capabilities?: Record<string, any>;
    /**
     * Array of chain identifiers allowed in this scope.
     */
    chains?: Array<string>;
    clientContext?: ClientContext;
};

