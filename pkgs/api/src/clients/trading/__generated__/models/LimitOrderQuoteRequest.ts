/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChainId } from './ChainId';
import type { inputToken } from './inputToken';
import type { outputToken } from './outputToken';
import type { receiverWalletAddress } from './receiverWalletAddress';
import type { tokenAmount } from './tokenAmount';
import type { TradeType } from './TradeType';
export type LimitOrderQuoteRequest = {
    swapper: receiverWalletAddress;
    limitPrice?: string;
    amount: tokenAmount;
    orderDeadline?: number;
    type: TradeType;
    tokenIn: inputToken;
    tokenOut: outputToken;
    tokenInChainId: ChainId;
    tokenOutChainId: ChainId;
};

