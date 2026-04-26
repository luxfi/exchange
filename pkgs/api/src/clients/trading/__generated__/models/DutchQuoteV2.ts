/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AggregatedOutput } from './AggregatedOutput';
import type { ClassicGasUseEstimateUSD } from './ClassicGasUseEstimateUSD';
import type { DutchOrderInfoV2 } from './DutchOrderInfoV2';
import type { encodedOrder } from './encodedOrder';
import type { orderId } from './orderId';
import type { portionAmount } from './portionAmount';
import type { portionAmountReceiverAddress } from './portionAmountReceiverAddress';
import type { portionBips } from './portionBips';
import type { quoteId } from './quoteId';
import type { slippageTolerance } from './slippageTolerance';
export type DutchQuoteV2 = {
    encodedOrder: encodedOrder;
    orderId: orderId;
    orderInfo: DutchOrderInfoV2;
    portionBips?: portionBips;
    portionAmount?: portionAmount;
    portionRecipient?: portionAmountReceiverAddress;
    quoteId?: quoteId;
    slippageTolerance?: slippageTolerance;
    deadlineBufferSecs?: number;
    classicGasUseEstimateUSD?: ClassicGasUseEstimateUSD;
    aggregatedOutputs?: Array<AggregatedOutput>;
};

