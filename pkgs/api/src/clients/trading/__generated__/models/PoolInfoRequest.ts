/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChainId } from './ChainId';
import type { PoolParameters } from './PoolParameters';
import type { PoolReferenceByProtocol } from './PoolReferenceByProtocol';
import type { Protocols } from './Protocols';
export type PoolInfoRequest = {
    protocol: Protocols;
    poolParams?: PoolParameters;
    /**
     * Array of pool reference identifiers to query. Each reference should include the protocol, chainId, and either the pool address (V3), pool id (V4), or pair address (V2).
     */
    poolReferences?: Array<PoolReferenceByProtocol>;
    chainId?: ChainId;
    pageSize?: number;
    currentPage?: number;
};

