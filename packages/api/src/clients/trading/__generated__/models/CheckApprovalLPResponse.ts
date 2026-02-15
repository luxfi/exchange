/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { gasFee } from './gasFee';
import type { NullablePermit } from './NullablePermit';
import type { RequestId } from './RequestId';
import type { TransactionRequest } from './TransactionRequest';
export type CheckApprovalLPResponse = {
    requestId?: RequestId;
    token0Approval?: TransactionRequest;
    token1Approval?: TransactionRequest;
    token0Cancel?: TransactionRequest;
    token1Cancel?: TransactionRequest;
    positionTokenApproval?: TransactionRequest;
    permitData?: NullablePermit;
    token0PermitTransaction?: TransactionRequest;
    token1PermitTransaction?: TransactionRequest;
    positionTokenPermitTransaction?: TransactionRequest;
    gasFeeToken0Approval?: gasFee;
    gasFeeToken1Approval?: gasFee;
    gasFeePositionTokenApproval?: gasFee;
    gasFeeToken0Cancel?: gasFee;
    gasFeeToken1Cancel?: gasFee;
    gasFeeToken0Permit?: gasFee;
    gasFeeToken1Permit?: gasFee;
    gasFeePositionTokenPermit?: gasFee;
};

