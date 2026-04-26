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
import type { DutchInput } from './DutchInput';
import type { DutchOutput } from './DutchOutput';
import type { nonce } from './nonce';
import type { receiverWalletAddress } from './receiverWalletAddress';
export type DutchOrderInfoV2 = {
    chainId: ChainId;
    nonce: nonce;
    reactor: contractAddress;
    swapper: receiverWalletAddress;
    deadline: deadline;
    additionalValidationContract?: additionalValidationContract;
    additionalValidationData?: additionalValidationData;
    input: DutchInput;
    outputs: Array<DutchOutput>;
    cosigner?: cosignerAddress;
};

