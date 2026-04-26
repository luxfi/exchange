/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { contractAddress } from './contractAddress';
import type { liquidity } from './liquidity';
import type { poolFee } from './poolFee';
import type { sqrtRatioX96 } from './sqrtRatioX96';
import type { tickCurrent } from './tickCurrent';
import type { tickSpacing } from './tickSpacing';
import type { tokenAmount } from './tokenAmount';
import type { TokenInRoute } from './TokenInRoute';
export type V4PoolInRoute = {
    type: string;
    address: contractAddress;
    tokenIn: TokenInRoute;
    tokenOut: TokenInRoute;
    sqrtRatioX96: sqrtRatioX96;
    liquidity: liquidity;
    tickCurrent: tickCurrent;
    fee: poolFee;
    tickSpacing: tickSpacing;
    /**
     * The address of the hook for the pool, if any. If the pool has no hook, this field will be the null address (e.g. 0x0000000000000000000000000000000000000000).
     */
    hooks: string;
    amountIn?: tokenAmount;
    amountOut?: tokenAmount;
};

