/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Gas strategy configuration for transaction fee estimation.
 */
export type GasStrategy = {
    /**
     * Factor to inflate the gas limit estimate.
     */
    limitInflationFactor: number;
    /**
     * Factor to inflate the gas price estimate.
     */
    priceInflationFactor: number;
    /**
     * Percentile threshold for EIP-1559 fee calculation.
     */
    percentileThresholdFor1559Fee: number;
    /**
     * Threshold to inflate the last block base fee.
     */
    thresholdToInflateLastBlockBaseFee?: number;
    /**
     * Multiplier for the base fee.
     */
    baseFeeMultiplier?: number;
    /**
     * Number of blocks to consider for base fee history.
     */
    baseFeeHistoryWindow?: number;
    /**
     * Minimum priority fee as a ratio of base fee.
     */
    minPriorityFeeRatioOfBaseFee?: number;
    /**
     * Minimum priority fee in Gwei.
     */
    minPriorityFeeGwei?: number;
    /**
     * Maximum priority fee in Gwei.
     */
    maxPriorityFeeGwei?: number;
};

