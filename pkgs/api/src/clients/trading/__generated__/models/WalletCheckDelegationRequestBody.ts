/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { ChainId } from './ChainId';
export type WalletCheckDelegationRequestBody = {
    /**
     * Array of wallet addresses to check delegation status for.
     */
    walletAddresses?: Array<Address>;
    /**
     * Array of chain IDs to check delegation status for.
     */
    chainIds: Array<ChainId>;
};

