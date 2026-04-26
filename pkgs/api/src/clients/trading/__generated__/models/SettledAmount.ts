/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { inputToken } from './inputToken';
import type { outputToken } from './outputToken';
import type { tokenAmount } from './tokenAmount';
export type SettledAmount = {
    tokenOut?: outputToken;
    amountOut?: tokenAmount;
    tokenIn?: inputToken;
    amountIn?: tokenAmount;
};

