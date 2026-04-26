/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { gasFee } from './gasFee';
import type { RequestId } from './RequestId';
import type { TransactionRequest } from './TransactionRequest';
export type CreateSwapResponse = {
    requestId: RequestId;
    swap: TransactionRequest;
    gasFee?: gasFee;
};

