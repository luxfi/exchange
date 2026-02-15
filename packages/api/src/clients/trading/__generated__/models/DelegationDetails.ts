/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DelegationDetails = {
    /**
     * Whether the current delegation address is a Uniswap delegation address.
     */
    isWalletDelegatedToUniswap: boolean;
    /**
     * The current delegation address of the wallet. May be null if the wallet does not currently delegate to any address.
     */
    currentDelegationAddress: string | null;
    /**
     * The latest delegation address that the wallet could upgrade to.
     */
    latestDelegationAddress: string;
};

