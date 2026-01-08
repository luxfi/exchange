export declare type HookPermissions = {
    [key in HookOptions]: boolean;
};
export declare enum HookOptions {
    AfterRemoveLiquidityReturnsDelta = "afterRemoveLiquidityReturnsDelta",
    AfterAddLiquidityReturnsDelta = "afterAddLiquidityReturnsDelta",
    AfterSwapReturnsDelta = "afterSwapReturnsDelta",
    BeforeSwapReturnsDelta = "beforeSwapReturnsDelta",
    AfterDonate = "afterDonate",
    BeforeDonate = "beforeDonate",
    AfterSwap = "afterSwap",
    BeforeSwap = "beforeSwap",
    AfterRemoveLiquidity = "afterRemoveLiquidity",
    BeforeRemoveLiquidity = "beforeRemoveLiquidity",
    AfterAddLiquidity = "afterAddLiquidity",
    BeforeAddLiquidity = "beforeAddLiquidity",
    AfterInitialize = "afterInitialize",
    BeforeInitialize = "beforeInitialize"
}
export declare const hookFlagIndex: {
    afterRemoveLiquidityReturnsDelta: number;
    afterAddLiquidityReturnsDelta: number;
    afterSwapReturnsDelta: number;
    beforeSwapReturnsDelta: number;
    afterDonate: number;
    beforeDonate: number;
    afterSwap: number;
    beforeSwap: number;
    afterRemoveLiquidity: number;
    beforeRemoveLiquidity: number;
    afterAddLiquidity: number;
    beforeAddLiquidity: number;
    afterInitialize: number;
    beforeInitialize: number;
};
export declare class Hook {
    static permissions(address: string): HookPermissions;
    static hasPermission(address: string, hookOption: HookOptions): boolean;
    static hasInitializePermissions(address: string): boolean;
    static hasLiquidityPermissions(address: string): boolean;
    static hasSwapPermissions(address: string): boolean;
    static hasDonatePermissions(address: string): boolean;
    private static _hasPermission;
    private static _checkAddress;
}
