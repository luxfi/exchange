/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AutoSlippage } from './AutoSlippage';
import type { ChainId } from './ChainId';
import type { ClassicInput } from './ClassicInput';
import type { ClassicOutput } from './ClassicOutput';
import type { gasFee } from './gasFee';
import type { gasFeeInCurrency } from './gasFeeInCurrency';
import type { gasFeeUSD } from './gasFeeUSD';
import type { gasLimit } from './gasLimit';
import type { gasPrice } from './gasPrice';
import type { GasStrategy } from './GasStrategy';
import type { HooksOptions } from './HooksOptions';
import type { maxFeePerGas } from './maxFeePerGas';
import type { maxPriorityFeePerGas } from './maxPriorityFeePerGas';
import type { Protocols } from './Protocols';
import type { quoteId } from './quoteId';
import type { senderWalletAddress } from './senderWalletAddress';
import type { slippageTolerance } from './slippageTolerance';
import type { TradeType } from './TradeType';
import type { TruncatedPlanStep } from './TruncatedPlanStep';
import { GasEstimate } from "../../types";

/**
 * A quote for a chained transaction flow that spans multiple steps, potentially across multiple chains.
 */
export type ChainedQuote = {
    swapper: senderWalletAddress;
    input: ClassicInput;
    output: ClassicOutput;
    tokenInChainId: ChainId;
    tokenOutChainId: ChainId;
    tradeType: TradeType;
    quoteId: quoteId;
    /**
     * Estimated time in milliseconds to complete the entire chained flow.
     */
    timeEstimateMs?: number;
    gasUseEstimate?: gasLimit;
    gasFeeUSD?: gasFeeUSD;
    gasFeeQuote?: gasFeeInCurrency;
    gasPrice?: gasPrice;
    maxFeePerGas?: maxFeePerGas;
    maxPriorityFeePerGas?: maxPriorityFeePerGas;
    gasFee?: gasFee;
    protocols?: Protocols;
    hooksOptions?: HooksOptions;
    /**
     * Gas strategies for the chained flow.
     */
    gasStrategies: Array<GasStrategy>;
    /**
     * Truncated plan steps for the chained transaction flow.
     */
    steps?: Array<TruncatedPlanStep>;
    slippageTolerance?: slippageTolerance;
    autoSlippage?: AutoSlippage;
    gasEstimates?: GasEstimate[];
    slippage?: slippageTolerance;
};

