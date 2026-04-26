/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { additionalValidationContract } from './additionalValidationContract';
import type { additionalValidationData } from './additionalValidationData';
import type { ChainId } from './ChainId';
import type { contractAddress } from './contractAddress';
import type { deadline } from './deadline';
import type { DutchInput } from './DutchInput';
import type { DutchOutput } from './DutchOutput';
import type { nonce } from './nonce';
import type { receiverWalletAddress } from './receiverWalletAddress';
export type DutchOrderInfo = {
    chainId: ChainId;
    nonce: nonce;
    reactor: contractAddress;
    swapper: receiverWalletAddress;
    deadline: deadline;
    additionalValidationContract?: additionalValidationContract;
    additionalValidationData?: additionalValidationData;
    /**
     * The unix timestamp at which the order will be eligible to be filled by alternate fillers at a lower price. Noted that the fill amount will not be lower than the output `endAmount`.
     */
    decayStartTime?: number;
    /**
     * The unix timestamp at which the order will no longer be eligible to be filled by alternate fillers.
     */
    decayEndTime?: number;
    /**
     * The address of the filler who has priority to fill the order by the `decayStartTime`.
     */
    exclusiveFiller: string;
    /**
     * The portion of the order which is eligible to be filled by the `exclusiveFiller`, specified in basis points.
     */
    exclusivityOverrideBps: string;
    input: DutchInput;
    outputs: Array<DutchOutput>;
};

