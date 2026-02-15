/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { tickSpacing } from './tickSpacing';
export type PoolParameters = {
    token0?: string;
    token1?: string;
    /**
     * The fee of the pool, if the pool has a fee value.
     */
    fee?: number;
    tickSpacing?: tickSpacing;
    /**
     * The address of the hook for the pool, if any.
     */
    hookAddress?: string;
};

