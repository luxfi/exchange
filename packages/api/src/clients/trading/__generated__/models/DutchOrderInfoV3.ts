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
import type { DutchInputV3 } from './DutchInputV3';
import type { DutchOutputV3 } from './DutchOutputV3';
import type { nonce } from './nonce';
import type { receiverWalletAddress } from './receiverWalletAddress';
export type DutchOrderInfoV3 = {
    chainId: ChainId;
    nonce: nonce;
    reactor: contractAddress;
    swapper: receiverWalletAddress;
    deadline: deadline;
    additionalValidationContract?: additionalValidationContract;
    additionalValidationData?: additionalValidationData;
    input: DutchInputV3;
    outputs: Array<DutchOutputV3>;
    cosigner?: cosignerAddress;
    startingBaseFee?: string;
};

