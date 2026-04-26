/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RequestId } from './RequestId';
import type { Routing } from './Routing';
import type { SwapStatus } from './SwapStatus';
import type { TransactionHash } from './TransactionHash';
export type GetSwapsResponse = {
    requestId: RequestId;
    swaps?: Array<{
        swapType?: Routing;
        status?: SwapStatus;
        txHash?: TransactionHash;
        swapId?: string;
    }>;
};

