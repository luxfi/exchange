/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { ChainId } from './ChainId';
import type { deadline } from './deadline';
import type { IndependentToken } from './IndependentToken';
import type { liquidity } from './liquidity';
import type { lpTickCurrent } from './lpTickCurrent';
import type { Permit } from './Permit';
import type { Position } from './Position';
import type { ProtocolItems } from './ProtocolItems';
import type { sqrtRatioX96 } from './sqrtRatioX96';
import type { tokenAmount } from './tokenAmount';
export type IncreaseLPPositionRequest = {
    protocol?: ProtocolItems;
    tokenId?: number;
    position?: Position;
    poolLiquidity?: liquidity;
    currentTick?: lpTickCurrent;
    sqrtRatioX96?: sqrtRatioX96;
    walletAddress?: Address;
    chainId?: ChainId;
    amount0?: tokenAmount;
    amount1?: tokenAmount;
    independentAmount?: tokenAmount;
    independentToken?: IndependentToken;
    defaultDependentAmount?: tokenAmount;
    slippageTolerance?: number;
    deadline?: deadline;
    /**
     * The signed permit.
     */
    signature?: string;
    batchPermitData?: Permit;
    simulateTransaction?: boolean;
};

