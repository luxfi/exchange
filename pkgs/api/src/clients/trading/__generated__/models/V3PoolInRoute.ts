/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { contractAddress } from './contractAddress';
import type { liquidity } from './liquidity';
import type { poolFee } from './poolFee';
import type { sqrtRatioX96 } from './sqrtRatioX96';
import type { tickCurrent } from './tickCurrent';
import type { tokenAmount } from './tokenAmount';
import type { TokenInRoute } from './TokenInRoute';
export type V3PoolInRoute = {
    type?: string;
    address?: contractAddress;
    tokenIn?: TokenInRoute;
    tokenOut?: TokenInRoute;
    sqrtRatioX96?: sqrtRatioX96;
    liquidity?: liquidity;
    tickCurrent?: tickCurrent;
    fee?: poolFee;
    amountIn?: tokenAmount;
    amountOut?: tokenAmount;
};

