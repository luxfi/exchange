/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChainId } from './ChainId';
import type { ClassicInput } from './ClassicInput';
import type { ClassicOutput } from './ClassicOutput';
import type { gasFee } from './gasFee';
import type { gasFeeUSD } from './gasFeeUSD';
import type { gasLimit } from './gasLimit';
import type { gasPrice } from './gasPrice';
import type { maxFeePerGas } from './maxFeePerGas';
import type { maxPriorityFeePerGas } from './maxPriorityFeePerGas';
import type { portionAmount } from './portionAmount';
import type { portionAmountReceiverAddress } from './portionAmountReceiverAddress';
import type { portionBips } from './portionBips';
import type { quoteId } from './quoteId';
import type { receiverWalletAddress } from './receiverWalletAddress';
import type { TradeType } from './TradeType';
export type BridgeQuote = {
    quoteId?: quoteId;
    chainId?: ChainId;
    destinationChainId?: ChainId;
    swapper?: receiverWalletAddress;
    input?: ClassicInput;
    output?: ClassicOutput;
    tradeType?: TradeType;
    quoteTimestamp?: number;
    gasPrice?: gasPrice;
    maxFeePerGas?: maxFeePerGas;
    maxPriorityFeePerGas?: maxPriorityFeePerGas;
    gasFee?: gasFee;
    gasUseEstimate?: gasLimit;
    gasFeeUSD?: gasFeeUSD;
    portionBips?: portionBips;
    portionAmount?: portionAmount;
    portionRecipient?: portionAmountReceiverAddress;
    /**
     * The estimated time it will take to fill the order in milliseconds.
     */
    estimatedFillTimeMs?: number;
    /**
     * The address of the exclusive filler (the relayer).
     */
    exclusiveRelayer?: string;
    /**
     * The deadline (unix timestamp) by which the exclusive relayer must fill the order before other relayers can fill it.
     */
    exclusivityDeadline?: number;
    /**
     * The deadline by which, if the order is not filled, the order will be reverted.
     */
    fillDeadline?: number;
};

