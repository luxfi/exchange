/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AggregatedOutput } from './AggregatedOutput';
import type { ChainId } from './ChainId';
import type { ClassicInput } from './ClassicInput';
import type { ClassicOutput } from './ClassicOutput';
import type { gasFee } from './gasFee';
import type { gasFeeInCurrency } from './gasFeeInCurrency';
import type { gasFeeUSD } from './gasFeeUSD';
import type { gasPrice } from './gasPrice';
import type { maxFeePerGas } from './maxFeePerGas';
import type { maxPriorityFeePerGas } from './maxPriorityFeePerGas';
import type { portionAmount } from './portionAmount';
import type { portionAmountReceiverAddress } from './portionAmountReceiverAddress';
import type { portionBips } from './portionBips';
import type { quoteId } from './quoteId';
import type { senderWalletAddress } from './senderWalletAddress';
import type { slippageTolerance } from './slippageTolerance';
import type { TradeType } from './TradeType';
import type { TransactionFailureReason } from './TransactionFailureReason';
import type { V2PoolInRoute } from './V2PoolInRoute';
import type { V3PoolInRoute } from './V3PoolInRoute';
import type { V4PoolInRoute } from './V4PoolInRoute';
import { GasEstimate } from "../../types";

export type ClassicQuote = {
    input?: ClassicInput;
    output?: ClassicOutput;
    swapper?: senderWalletAddress;
    chainId?: ChainId;
    slippage?: slippageTolerance;
    tradeType?: TradeType;
    gasFee?: gasFee;
    gasFeeUSD?: gasFeeUSD;
    gasFeeQuote?: gasFeeInCurrency;
    route?: Array<Array<(V2PoolInRoute | V3PoolInRoute | V4PoolInRoute)>>;
    portionBips?: portionBips;
    portionAmount?: portionAmount;
    portionRecipient?: portionAmountReceiverAddress;
    /**
     * The route in string format.
     */
    routeString?: string;
    quoteId?: quoteId;
    /**
     * The estimated gas use. It does NOT include the additional gas for token approvals.
     */
    gasUseEstimate?: string;
    /**
     * The current block number.
     */
    blockNumber?: string;
    gasPrice?: gasPrice;
    maxFeePerGas?: maxFeePerGas;
    maxPriorityFeePerGas?: maxPriorityFeePerGas;
    /**
     * The reason(s) why the transaction failed during simulation.
     */
    txFailureReasons?: Array<TransactionFailureReason>;
    /**
     * The impact the trade has on the market price of the pool, between 0-100 percent
     */
    priceImpact?: number;
    aggregatedOutputs?: Array<AggregatedOutput>;
    gasEstimates?: GasEstimate[];
};

