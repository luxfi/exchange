/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChainId } from './ChainId';
import type { ClassicInput } from './ClassicInput';
import type { ClassicOutput } from './ClassicOutput';
import type { gasFee } from './gasFee';
import type { gasFeeInCurrency } from './gasFeeInCurrency';
import type { gasFeeUSD } from './gasFeeUSD';
import type { gasLimit } from './gasLimit';
import type { gasPrice } from './gasPrice';
import type { maxFeePerGas } from './maxFeePerGas';
import type { maxPriorityFeePerGas } from './maxPriorityFeePerGas';
import type { quoteId } from './quoteId';
import type { senderWalletAddress } from './senderWalletAddress';
import type { TradeType } from './TradeType';
import { GasEstimate } from "../../types";
import { slippageTolerance } from "./slippageTolerance";

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
    gasEstimates?: GasEstimate[];
    slippage?: slippageTolerance;
};

