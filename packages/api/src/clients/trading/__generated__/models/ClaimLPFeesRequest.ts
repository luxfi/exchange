/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { ChainId } from './ChainId';
import type { Position } from './Position';
import type { ProtocolItems } from './ProtocolItems';
export type ClaimLPFeesRequest = {
    protocol?: ProtocolItems;
    tokenId?: number;
    position?: Position;
    walletAddress?: Address;
    chainId?: ChainId;
    expectedTokenOwed0RawAmount?: string;
    expectedTokenOwed1RawAmount?: string;
    collectAsWETH?: boolean;
    simulateTransaction?: boolean;
};

