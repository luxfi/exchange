/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { additionalValidationContract } from './additionalValidationContract';
import type { additionalValidationData } from './additionalValidationData';
import type { ChainId } from './ChainId';
import type { contractAddress } from './contractAddress';
import type { cosignerAddress } from './cosignerAddress';
import type { deadline } from './deadline';
import type { nonce } from './nonce';
import type { PriorityInput } from './PriorityInput';
import type { PriorityOutput } from './PriorityOutput';
import type { receiverWalletAddress } from './receiverWalletAddress';
export type PriorityOrderInfo = {
    chainId: ChainId;
    nonce: nonce;
    reactor: contractAddress;
    swapper: receiverWalletAddress;
    deadline: deadline;
    additionalValidationContract?: additionalValidationContract;
    additionalValidationData?: additionalValidationData;
    auctionStartBlock: string;
    baselinePriorityFeeWei: string;
    input: PriorityInput;
    outputs: Array<PriorityOutput>;
    cosigner: cosignerAddress;
};

