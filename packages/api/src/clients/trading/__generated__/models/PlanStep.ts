/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChainId } from './ChainId';
import type { gasFee } from './gasFee';
import type { gasFeeInCurrency } from './gasFeeInCurrency';
import type { gasFeeUSD } from './gasFeeUSD';
import type { gasLimit } from './gasLimit';
import type { gasPrice } from './gasPrice';
import type { inputToken } from './inputToken';
import type { maxFeePerGas } from './maxFeePerGas';
import type { maxPriorityFeePerGas } from './maxPriorityFeePerGas';
import type { outputToken } from './outputToken';
import type { PlanStepMethod } from './PlanStepMethod';
import type { PlanStepPayloadType } from './PlanStepPayloadType';
import type { PlanStepProof } from './PlanStepProof';
import type { PlanStepStatus } from './PlanStepStatus';
import type { receiverWalletAddress } from './receiverWalletAddress';
import type { Routing } from './Routing';
import type { senderWalletAddress } from './senderWalletAddress';
import type { tokenAmount } from './tokenAmount';
export type PlanStep = {
    /**
     * The index of this step in the plan (0-based).
     */
    stepIndex: number;
    method: PlanStepMethod;
    payloadType: PlanStepPayloadType;
    /**
     * The payload data for this step. The structure depends on the payloadType.
     */
    payload: Record<string, any>;
    status: PlanStepStatus;
    proof?: PlanStepProof;
    tokenIn?: inputToken;
    tokenOut?: outputToken;
    tokenInChainId?: ChainId;
    tokenOutChainId?: ChainId;
    tokenInAmount?: tokenAmount;
    tokenOutAmount?: tokenAmount;
    swapper?: senderWalletAddress;
    recipient?: receiverWalletAddress;
    stepSwapType?: Routing;
    gasUseEstimate?: gasLimit;
    gasFeeUSD?: gasFeeUSD;
    gasFeeQuote?: gasFeeInCurrency;
    gasPrice?: gasPrice;
    maxFeePerGas?: maxFeePerGas;
    maxPriorityFeePerGas?: maxPriorityFeePerGas;
    gasFee?: gasFee;
    /**
     * An optional key identifying the routing strategy used for this step.
     */
    routingStepKey?: string;
    stepType?: string;
};

