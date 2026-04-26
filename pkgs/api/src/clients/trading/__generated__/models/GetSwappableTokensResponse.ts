/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { ChainId } from './ChainId';
import type { isSpam } from './isSpam';
import type { RequestId } from './RequestId';
import type { TokenProject } from './TokenProject';
import type { tokenSymbol } from './tokenSymbol';
export type GetSwappableTokensResponse = {
    requestId: RequestId;
    tokens: Array<{
        address: Address;
        chainId: ChainId;
        /**
         * The name of the token.
         */
        name: string;
        symbol: tokenSymbol;
        project: TokenProject;
        isSpam?: isSpam;
        /**
         * The number of decimals supported by the token. This number is used to convert token amounts to the token's common representation.
         */
        decimals: number;
    }>;
};

