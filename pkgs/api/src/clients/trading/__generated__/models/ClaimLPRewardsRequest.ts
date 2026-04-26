/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { ChainId } from './ChainId';
import type { claimerWalletAddress } from './claimerWalletAddress';
import type { Distributor } from './Distributor';
export type ClaimLPRewardsRequest = {
    walletAddress?: claimerWalletAddress;
    chainId?: ChainId;
    /**
     * The token addresses to claim rewards for.
     */
    tokens?: Array<Address>;
    distributor?: Distributor;
    simulateTransaction?: boolean;
};

