import JSBI from 'jsbi';
export declare const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export declare const NEGATIVE_ONE: JSBI;
export declare const ZERO: JSBI;
export declare const ONE: JSBI;
export declare const ONE_ETHER: JSBI;
export declare const EMPTY_BYTES = "0x";
export declare const Q96: JSBI;
export declare const Q192: JSBI;
export declare const FEE_AMOUNT_LOW = 100;
export declare const FEE_AMOUNT_MEDIUM = 3000;
export declare const FEE_AMOUNT_HIGHEST = 10000;
export declare const TICK_SPACING_TEN = 10;
export declare const TICK_SPACING_SIXTY = 60;
export declare const MIN_SLIPPAGE_DECREASE = 0;
export declare const OPEN_DELTA: import("ethers").BigNumber;
export declare const SQRT_PRICE_1_1: JSBI;
export declare const EMPTY_HOOK = "0x0000000000000000000000000000000000000000";
export declare const NATIVE_NOT_SET = "NATIVE_NOT_SET";
export declare const ZERO_LIQUIDITY = "ZERO_LIQUIDITY";
export declare const NO_SQRT_PRICE = "NO_SQRT_PRICE";
export declare const CANNOT_BURN = "CANNOT_BURN";
/**
 * Function fragments that exist on the PositionManager contract.
 */
export declare enum PositionFunctions {
    INITIALIZE_POOL = "initializePool",
    MODIFY_LIQUIDITIES = "modifyLiquidities",
    PERMIT_BATCH = "0x002a3e3a",
    ERC721PERMIT_PERMIT = "0x0f5730f1"
}
/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export declare enum FeeAmount {
    LOWEST = 100,
    LOW = 500,
    MEDIUM = 3000,
    HIGH = 10000
}
/**
 * The default factory tick spacings by fee amount.
 */
export declare const TICK_SPACINGS: {
    [amount in FeeAmount]: number;
};
