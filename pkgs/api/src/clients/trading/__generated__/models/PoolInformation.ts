/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChainId } from './ChainId';
import type { liquidity } from './liquidity';
import type { lpTickCurrent } from './lpTickCurrent';
import type { poolFee } from './poolFee';
import type { Protocols } from './Protocols';
import type { sqrtRatioX96 } from './sqrtRatioX96';
import type { tickSpacing } from './tickSpacing';
import type { tokenAmount } from './tokenAmount';
export type PoolInformation = {
    /**
     * The unique identifier for the pool reference, which can be a pool address, pool id, or pair address depending on the protocol.
     */
    poolReferenceIdentifier?: string;
    poolProtocol?: Protocols;
    tokenAddressA?: string;
    tokenAddressB?: string;
    tickSpacing?: tickSpacing;
    fee?: poolFee;
    /**
     * The address of the hook for the pool, if any.
     */
    hookAddress?: string;
    chainId?: ChainId;
    tokenAmountA?: tokenAmount;
    tokenAmountB?: tokenAmount;
    /**
     * The number of decimals for token A.
     */
    tokenDecimalsA?: number;
    /**
     * The number of decimals for token B.
     */
    tokenDecimalsB?: number;
    poolLiquidity?: liquidity;
    sqrtRatioX96?: sqrtRatioX96;
    currentTick?: lpTickCurrent;
    tokenAReserves?: tokenAmount;
    tokenBReserves?: tokenAmount;
};

