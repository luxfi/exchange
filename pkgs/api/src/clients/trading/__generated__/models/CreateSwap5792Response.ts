/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { ChainId } from './ChainId';
import type { gasFee } from './gasFee';
import type { RequestId } from './RequestId';
import type { TransactionRequest5792 } from './TransactionRequest5792';
export type CreateSwap5792Response = {
    requestId: RequestId;
    from: Address;
    chainId: ChainId;
    calls: Array<TransactionRequest5792>;
    gasFee?: gasFee;
};

