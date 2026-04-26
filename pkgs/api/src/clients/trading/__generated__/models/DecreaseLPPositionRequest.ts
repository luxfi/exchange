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
import type { sqrtRatioX96 } from './sqrtRatioX96';
export type DecreaseLPPositionRequest = {
    protocol?: ProtocolItems;
    tokenId?: number;
    position?: Position;
    walletAddress?: Address;
    chainId?: ChainId;
    liquidityPercentageToDecrease?: number;
    liquidity0?: string;
    liquidity1?: string;
    slippageTolerance?: number;
    poolLiquidity?: liquidity;
    currentTick?: lpTickCurrent;
    sqrtRatioX96?: sqrtRatioX96;
    positionLiquidity?: string;
    expectedTokenOwed0RawAmount?: string;
    expectedTokenOwed1RawAmount?: string;
    collectAsWETH?: boolean;
    deadline?: deadline;
    simulateTransaction?: boolean;
};

