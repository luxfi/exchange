import { BigNumber } from 'ethers';
import { Currency, Percent, TradeType } from '@uniswap/sdk-core';
import { Trade } from '../entities/trade';
/**
 * Actions
 * @description Constants that define what action to perform
 * Not all actions are supported yet.
 * @enum {number}
 */
export declare enum Actions {
    INCREASE_LIQUIDITY = 0,
    DECREASE_LIQUIDITY = 1,
    MINT_POSITION = 2,
    BURN_POSITION = 3,
    SWAP_EXACT_IN_SINGLE = 6,
    SWAP_EXACT_IN = 7,
    SWAP_EXACT_OUT_SINGLE = 8,
    SWAP_EXACT_OUT = 9,
    SETTLE = 11,
    SETTLE_ALL = 12,
    SETTLE_PAIR = 13,
    TAKE = 14,
    TAKE_ALL = 15,
    TAKE_PORTION = 16,
    TAKE_PAIR = 17,
    CLOSE_CURRENCY = 18,
    SWEEP = 20,
    UNWRAP = 22
}
export declare enum Subparser {
    V4SwapExactInSingle = 0,
    V4SwapExactIn = 1,
    V4SwapExactOutSingle = 2,
    V4SwapExactOut = 3,
    PoolKey = 4
}
export declare type ParamType = {
    readonly name: string;
    readonly type: string;
    readonly subparser?: Subparser;
};
export declare const V4_BASE_ACTIONS_ABI_DEFINITION: {
    [key in Actions]: readonly ParamType[];
};
export declare class V4Planner {
    actions: string;
    params: string[];
    constructor();
    addAction(type: Actions, parameters: any[]): V4Planner;
    addTrade(trade: Trade<Currency, Currency, TradeType>, slippageTolerance?: Percent): V4Planner;
    addSettle(currency: Currency, payerIsUser: boolean, amount?: BigNumber): V4Planner;
    addTake(currency: Currency, recipient: string, amount?: BigNumber): V4Planner;
    addUnwrap(amount: BigNumber): V4Planner;
    finalize(): string;
}
