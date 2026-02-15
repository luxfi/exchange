/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChainId } from './ChainId';
import type { gasLimit } from './gasLimit';
import type { gasPrice } from './gasPrice';
import type { maxFeePerGas } from './maxFeePerGas';
import type { maxPriorityFeePerGas } from './maxPriorityFeePerGas';
import type { receiverWalletAddress } from './receiverWalletAddress';
import type { senderWalletAddress } from './senderWalletAddress';
export type TransactionRequest = {
    to: receiverWalletAddress;
    from: senderWalletAddress;
    /**
     * The calldata for the transaction.
     */
    data: string;
    /**
     * The quantity of ETH tokens approved for spending by the transaction, denominated in wei. Note that by default Uniswap Labs sets this to the maximum approvable spend.
     */
    value: string;
    gasLimit?: gasLimit;
    chainId: ChainId;
    maxFeePerGas?: maxFeePerGas;
    maxPriorityFeePerGas?: maxPriorityFeePerGas;
    gasPrice?: gasPrice;
};

