/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { gasFee } from './gasFee';
import type { liquidity } from './liquidity';
import type { lpTickCurrent } from './lpTickCurrent';
import type { RequestId } from './RequestId';
import type { sqrtRatioX96 } from './sqrtRatioX96';
import type { TransactionRequest } from './TransactionRequest';
export type DecreaseLPPositionResponse = {
    requestId?: RequestId;
    decrease?: TransactionRequest;
    gasFee?: gasFee;
    poolLiquidity?: liquidity;
    currentTick?: lpTickCurrent;
    sqrtRatioX96?: sqrtRatioX96;
};

