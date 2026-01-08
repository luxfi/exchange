import { BigintIsh, Percent, NativeCurrency } from '@uniswap/sdk-core';
import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';
import { Position } from './entities/position';
import { MethodParameters } from './utils/calldata';
import { Interface } from '@ethersproject/abi';
import { PoolKey } from './entities';
export interface CommonOptions {
    /**
     * How much the pool price is allowed to move from the specified action.
     */
    slippageTolerance: Percent;
    /**
     * Optional data to pass to hooks
     */
    hookData?: string;
    /**
     * When the transaction expires, in epoch seconds.
     */
    deadline: BigintIsh;
}
export interface ModifyPositionSpecificOptions {
    /**
     * Indicates the ID of the position to increase liquidity for.
     */
    tokenId: BigintIsh;
}
export interface MintSpecificOptions {
    /**
     * The account that should receive the minted NFT.
     */
    recipient: string;
    /**
     * Creates pool if not initialized before mint.
     */
    createPool?: boolean;
    /**
     * Initial price to set on the pool if creating
     */
    sqrtPriceX96?: BigintIsh;
    /**
     * Whether the mint is part of a migration from V3 to V4.
     */
    migrate?: boolean;
}
/**
 * Options for producing the calldata to add liquidity.
 */
export interface CommonAddLiquidityOptions {
    /**
     * Whether to spend ether. If true, one of the currencies must be the NATIVE currency.
     */
    useNative?: NativeCurrency;
    /**
     * The optional permit2 batch permit parameters for spending token0 and token1
     */
    batchPermit?: BatchPermitOptions;
}
/**
 * Options for producing the calldata to exit a position.
 */
export interface RemoveLiquiditySpecificOptions {
    /**
     * The percentage of position liquidity to exit.
     */
    liquidityPercentage: Percent;
    /**
     * Whether the NFT should be burned if the entire position is being exited, by default false.
     */
    burnToken?: boolean;
    /**
     * The optional permit of the token ID being exited, in case the exit transaction is being sent by an account that does not own the NFT
     */
    permit?: NFTPermitOptions;
}
export interface CollectSpecificOptions {
    /**
     * Indicates the ID of the position to collect for.
     */
    tokenId: BigintIsh;
    /**
     * The account that should receive the tokens.
     */
    recipient: string;
}
export interface TransferOptions {
    /**
     * The account sending the NFT.
     */
    sender: string;
    /**
     * The account that should receive the NFT.
     */
    recipient: string;
    /**
     * The id of the token being sent.
     */
    tokenId: BigintIsh;
}
export interface PermitDetails {
    token: string;
    amount: BigintIsh;
    expiration: BigintIsh;
    nonce: BigintIsh;
}
export interface AllowanceTransferPermitSingle {
    details: PermitDetails;
    spender: string;
    sigDeadline: BigintIsh;
}
export interface AllowanceTransferPermitBatch {
    details: PermitDetails[];
    spender: string;
    sigDeadline: BigintIsh;
}
export interface BatchPermitOptions {
    owner: string;
    permitBatch: AllowanceTransferPermitBatch;
    signature: string;
}
export interface NFTPermitValues {
    spender: string;
    tokenId: BigintIsh;
    deadline: BigintIsh;
    nonce: BigintIsh;
}
export interface NFTPermitOptions extends NFTPermitValues {
    signature: string;
}
export interface NFTPermitData {
    domain: TypedDataDomain;
    types: Record<string, TypedDataField[]>;
    values: NFTPermitValues;
}
export declare type MintOptions = CommonOptions & CommonAddLiquidityOptions & MintSpecificOptions;
export declare type IncreaseLiquidityOptions = CommonOptions & CommonAddLiquidityOptions & ModifyPositionSpecificOptions;
export declare type AddLiquidityOptions = MintOptions | IncreaseLiquidityOptions;
export declare type RemoveLiquidityOptions = CommonOptions & RemoveLiquiditySpecificOptions & ModifyPositionSpecificOptions;
export declare type CollectOptions = CommonOptions & CollectSpecificOptions;
export declare abstract class V4PositionManager {
    static INTERFACE: Interface;
    /**
     * Cannot be constructed.
     */
    private constructor();
    /**
     * Public methods to encode method parameters for different actions on the PositionManager contract
     */
    static createCallParameters(poolKey: PoolKey, sqrtPriceX96: BigintIsh): MethodParameters;
    static addCallParameters(position: Position, options: AddLiquidityOptions): MethodParameters;
    /**
     * Produces the calldata for completely or partially exiting a position
     * @param position The position to exit
     * @param options Additional information necessary for generating the calldata
     * @returns The call parameters
     */
    static removeCallParameters(position: Position, options: RemoveLiquidityOptions): MethodParameters;
    /**
     * Produces the calldata for collecting fees from a position
     * @param position The position to collect fees from
     * @param options Additional information necessary for generating the calldata
     * @returns The call parameters
     */
    static collectCallParameters(position: Position, options: CollectOptions): MethodParameters;
    private static encodeInitializePool;
    static encodeModifyLiquidities(unlockData: string, deadline: BigintIsh): string;
    static encodePermitBatch(owner: string, permitBatch: AllowanceTransferPermitBatch, signature: string): string;
    static encodeERC721Permit(spender: string, tokenId: BigintIsh, deadline: BigintIsh, nonce: BigintIsh, signature: string): string;
    static getPermitData(permit: NFTPermitValues, positionManagerAddress: string, chainId: number): NFTPermitData;
}
