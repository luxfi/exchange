/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { TransactionRequest } from './TransactionRequest';
export type WalletEncode7702RequestBody = {
    /**
     * Array of transaction requests to be encoded. All transactions must have the same chainId.
     */
    calls: Array<TransactionRequest>;
    /**
     * The address of the smart contract delegation implementation to use.
     */
    smartContractDelegationAddress: Address;
};

