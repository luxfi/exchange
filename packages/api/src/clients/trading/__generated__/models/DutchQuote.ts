/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AggregatedOutput } from './AggregatedOutput';
import type { ClassicGasUseEstimateUSD } from './ClassicGasUseEstimateUSD';
import type { DutchOrderInfo } from './DutchOrderInfo';
import type { encodedOrder } from './encodedOrder';
import type { orderId } from './orderId';
import type { portionAmount } from './portionAmount';
import type { portionAmountReceiverAddress } from './portionAmountReceiverAddress';
import type { portionBips } from './portionBips';
import type { quoteId } from './quoteId';
import type { slippageTolerance } from './slippageTolerance';
export type DutchQuote = {
    encodedOrder: encodedOrder;
    orderId: orderId;
    orderInfo: DutchOrderInfo;
    portionBips?: portionBips;
    portionAmount?: portionAmount;
    portionRecipient?: portionAmountReceiverAddress;
    quoteId?: quoteId;
    slippageTolerance?: slippageTolerance;
    classicGasUseEstimateUSD?: ClassicGasUseEstimateUSD;
    aggregatedOutputs?: Array<AggregatedOutput>;
};

