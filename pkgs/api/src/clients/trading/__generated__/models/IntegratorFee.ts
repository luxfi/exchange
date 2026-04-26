/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A fee configuration specifying the fee amount in basis points and the recipient address.
 */
export type IntegratorFee = {
    /**
     * Fee amount in basis points (1 bip = 0.01%). Must be greater than 0 and at most 500.
     */
    bips: number;
    /**
     * Ethereum address that receives the fee.
     */
    recipient: string;
};

