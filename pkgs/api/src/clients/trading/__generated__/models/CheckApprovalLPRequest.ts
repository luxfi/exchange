/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { ChainId } from './ChainId';
import type { generatePermitAsTransaction } from './generatePermitAsTransaction';
import type { inputToken } from './inputToken';
import type { ProtocolItems } from './ProtocolItems';
export type CheckApprovalLPRequest = {
    protocol?: ProtocolItems;
    token0?: inputToken;
    token1?: inputToken;
    /**
     * The address of the NFT representing the position. Required when requesting approval for removing liquidity from a V2 position (provide address of V2 NFT). Required when requesting approval for migrating a V3 position to a V4 position (provide address of V3 NFT).
     */
    positionToken?: string;
    chainId?: ChainId;
    walletAddress?: Address;
    /**
     * The amount of token0 to be added or removed from the position. To estimate the amount of token0 needed when adding a new position, use the /lp/create endpoint to simulate the position creation.
     */
    amount0?: string;
    /**
     * The amount of token1 to be added or removed from the position. To estimate the amount of token1 needed when adding a new position, use the /lp/create endpoint to simulate the position creation.
     */
    amount1?: string;
    generatePermitAsTransaction?: generatePermitAsTransaction;
    /**
     * Only required when getting approval for removing a V2 position. Populated with the amount of the V2 position to be removed (eg. amount0*amount1).
     */
    positionAmount?: string;
    simulateTransaction?: boolean;
};

