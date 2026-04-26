/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { ChainId } from './ChainId';
import type { deadline } from './deadline';
import type { liquidity } from './liquidity';
import type { lpTickCurrent } from './lpTickCurrent';
import type { Position } from './Position';
import type { ProtocolItems } from './ProtocolItems';
import type { slippageTolerance } from './slippageTolerance';
import type { sqrtRatioX96 } from './sqrtRatioX96';
import type { tokenAmount } from './tokenAmount';
export type MigrateLPPositionRequest = {
    tokenId: number;
    walletAddress: Address;
    chainId: ChainId;
    inputProtocol: ProtocolItems;
    inputPosition: Position;
    inputPoolLiquidity: liquidity;
    inputCurrentTick: lpTickCurrent;
    inputSqrtRatioX96: sqrtRatioX96;
    inputPositionLiquidity: liquidity;
    signature?: string;
    amount0: tokenAmount;
    amount1: tokenAmount;
    outputProtocol: ProtocolItems;
    outputPosition: Position;
    initialPrice?: string;
    outputPoolLiquidity?: liquidity;
    outputCurrentTick?: lpTickCurrent;
    outputSqrtRatioX96?: sqrtRatioX96;
    expectedTokenOwed0RawAmount: string;
    expectedTokenOwed1RawAmount: string;
    slippageTolerance?: slippageTolerance;
    deadline?: deadline;
    signatureDeadline?: number;
    simulateTransaction?: boolean;
};

