/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { gasFee } from './gasFee';
import type { gasFeeUSD } from './gasFeeUSD';
import type { RequestId } from './RequestId';
import type { TransactionRequest } from './TransactionRequest';
export type CreateSendResponse = {
    requestId: RequestId;
    send: TransactionRequest;
    gasFee?: gasFee;
    gasFeeUSD?: gasFeeUSD;
};

