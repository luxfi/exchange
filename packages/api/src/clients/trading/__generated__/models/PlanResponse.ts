/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { gasFee } from './gasFee';
import type { gasFeeInCurrency } from './gasFeeInCurrency';
import type { gasFeeUSD } from './gasFeeUSD';
import type { gasLimit } from './gasLimit';
import type { PlanStatus } from './PlanStatus';
import type { PlanStep } from './PlanStep';
import type { quoteId } from './quoteId';
import type { receiverWalletAddress } from './receiverWalletAddress';
import type { RequestId } from './RequestId';
import type { senderWalletAddress } from './senderWalletAddress';
import type { tokenAmount } from './tokenAmount';
export type PlanResponse = {
    requestId: RequestId;
    /**
     * A unique identifier for this execution plan.
     */
    planId: string;
    swapper: senderWalletAddress;
    recipient: receiverWalletAddress;
    quoteId: quoteId;
    status: PlanStatus;
    /**
     * The sequential steps that need to be executed to complete the plan.
     */
    steps: Array<PlanStep>;
    /**
     * The index of the current step that needs to be executed (0-based).
     */
    currentStepIndex: number;
    expectedOutput: tokenAmount;
    gasFee?: gasFee;
    gasFeeQuote?: gasFeeInCurrency;
    gasFeeUSD?: gasFeeUSD;
    gasUseEstimate?: gasLimit;
    /**
     * Estimated time in milliseconds to complete the entire plan.
     */
    timeEstimateMs?: number;
};

