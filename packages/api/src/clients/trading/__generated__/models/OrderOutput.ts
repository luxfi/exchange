/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { endAmount } from './endAmount';
import type { outputToken } from './outputToken';
import type { receiverWalletAddress } from './receiverWalletAddress';
import type { startAmount } from './startAmount';
export type OrderOutput = {
    token: outputToken;
    startAmount?: startAmount;
    endAmount?: endAmount;
    isFeeOutput?: boolean;
    recipient?: receiverWalletAddress;
};

