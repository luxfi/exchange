import { PoolKey } from '../entities/pool';
import { PathKey } from './encodeRouteToPath';
import { Actions } from './v4Planner';
export declare type Param = {
    readonly name: string;
    readonly value: any;
};
export declare type V4RouterAction = {
    readonly actionName: string;
    readonly actionType: Actions;
    readonly params: readonly Param[];
};
export declare type V4RouterCall = {
    readonly actions: readonly V4RouterAction[];
};
export declare type SwapExactInSingle = {
    readonly poolKey: PoolKey;
    readonly zeroForOne: boolean;
    readonly amountIn: string;
    readonly amountOutMinimum: string;
    readonly hookData: string;
};
export declare type SwapExactIn = {
    readonly currencyIn: string;
    readonly path: readonly PathKey[];
    readonly amountIn: string;
    readonly amountOutMinimum: string;
};
export declare type SwapExactOutSingle = {
    readonly poolKey: PoolKey;
    readonly zeroForOne: boolean;
    readonly amountOut: string;
    readonly amountInMaximum: string;
    readonly hookData: string;
};
export declare type SwapExactOut = {
    readonly currencyOut: string;
    readonly path: readonly PathKey[];
    readonly amountOut: string;
    readonly amountInMaximum: string;
};
export declare abstract class V4BaseActionsParser {
    static parseCalldata(calldata: string): V4RouterCall;
    private static getActions;
}
