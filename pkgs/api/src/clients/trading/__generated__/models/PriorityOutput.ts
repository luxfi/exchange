/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { outputToken } from './outputToken';
import type { receiverWalletAddress } from './receiverWalletAddress';
import type { tokenAmount } from './tokenAmount';
export type PriorityOutput = {
    amount: tokenAmount;
    token: outputToken;
    recipient: receiverWalletAddress;
    /**
     * The scaling factor of the priority fee based on the output token amount.
     */
    mpsPerPriorityFeeWei: string;
};

