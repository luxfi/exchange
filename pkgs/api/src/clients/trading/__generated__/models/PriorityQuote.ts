/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AggregatedOutput } from './AggregatedOutput';
import type { ClassicGasUseEstimateUSD } from './ClassicGasUseEstimateUSD';
import type { encodedOrder } from './encodedOrder';
import type { orderId } from './orderId';
import type { portionAmount } from './portionAmount';
import type { portionAmountReceiverAddress } from './portionAmountReceiverAddress';
import type { portionBips } from './portionBips';
import type { PriorityOrderInfo } from './PriorityOrderInfo';
import type { quoteId } from './quoteId';
import type { slippageTolerance } from './slippageTolerance';
import type { tokenAmount } from './tokenAmount';
export type PriorityQuote = {
    encodedOrder: encodedOrder;
    orderId: orderId;
    orderInfo: PriorityOrderInfo;
    portionBips?: portionBips;
    portionAmount?: portionAmount;
    portionRecipient?: portionAmountReceiverAddress;
    quoteId?: quoteId;
    slippageTolerance?: slippageTolerance;
    deadlineBufferSecs?: number;
    classicGasUseEstimateUSD?: ClassicGasUseEstimateUSD;
    expectedAmountIn?: tokenAmount;
    expectedAmountOut?: tokenAmount;
    aggregatedOutputs?: Array<AggregatedOutput>;
};

