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
import type { receiverWalletAddress } from './receiverWalletAddress';
import type { TradeType } from './TradeType';
export type WrapUnwrapQuote = {
    swapper?: receiverWalletAddress;
    input?: ClassicInput;
    output?: ClassicOutput;
    chainId?: ChainId;
    tradeType?: TradeType;
    gasFee?: gasFee;
    gasFeeUSD?: gasFeeUSD;
    gasFeeQuote?: gasFeeInCurrency;
    gasUseEstimate?: gasLimit;
    gasPrice?: gasPrice;
    maxFeePerGas?: maxFeePerGas;
    maxPriorityFeePerGas?: maxPriorityFeePerGas;
};

