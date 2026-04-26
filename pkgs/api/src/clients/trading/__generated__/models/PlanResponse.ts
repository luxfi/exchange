/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AutoSlippage } from './AutoSlippage';
import type { gasFee } from './gasFee';
import type { gasFeeInCurrency } from './gasFeeInCurrency';
import type { gasFeeUSD } from './gasFeeUSD';
import type { gasLimit } from './gasLimit';
import type { GasStrategy } from './GasStrategy';
import type { HooksOptions } from './HooksOptions';
import type { PlanStatus } from './PlanStatus';
import type { PlanStep } from './PlanStep';
import type { Protocols } from './Protocols';
import type { quoteId } from './quoteId';
import type { receiverWalletAddress } from './receiverWalletAddress';
import type { RequestId } from './RequestId';
import type { senderWalletAddress } from './senderWalletAddress';
import type { slippageTolerance } from './slippageTolerance';
import type { tokenAmount } from './tokenAmount';
import type { WalletExecutionContext } from './WalletExecutionContext';
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
    /**
     * Gas strategies used for the plan.
     */
    gasStrategies?: Array<GasStrategy>;
    protocols?: Protocols;
    hooksOptions?: HooksOptions;
    /**
     * Timestamp when the plan was created.
     */
    createdAt?: string;
    /**
     * Timestamp when the plan was last updated.
     */
    updatedAt?: string;
    /**
     * Timestamp when the plan completed.
     */
    completedAt?: string;
    /**
     * Timestamp of the last user action on this plan.
     */
    lastUserActionAt?: string;
    slippageTolerance?: slippageTolerance;
    autoSlippage?: AutoSlippage;
    walletExecutionContext?: WalletExecutionContext;
};

