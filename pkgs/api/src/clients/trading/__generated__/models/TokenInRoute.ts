/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { bpsFee } from './bpsFee';
import type { ChainId } from './ChainId';
import type { inputToken } from './inputToken';
import type { tokenSymbol } from './tokenSymbol';
export type TokenInRoute = {
    address?: inputToken;
    chainId?: ChainId;
    symbol?: tokenSymbol;
    /**
     * The number of decimals supported by the token. This number is used to convert token amounts to the token's common representation.
     */
    decimals?: string;
    buyFeeBps?: bpsFee;
    sellFeeBps?: bpsFee;
};

