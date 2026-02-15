/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The auto slippage strategy to employ. Presently there is a single slippage strategy, "DEFAULT", which uses a  combination of the estimated gas cost and swap size to calcualte a slippage. Note that the DEFAULT slippage strategy is bounded between (and including) 0.5% and 5.5%.
 *
 * If the trade type is `EXACT_INPUT`, then the slippage is in terms of the output token. If the trade type is `EXACT_OUTPUT`, then the slippage is in terms of the input token.
 *
 * When submitting a request, `autoSlippage` may not be set when `slippageTolerance` is defined. One of `slippageTolerance` or `autoSlippage` must be defined.
 */
export type AutoSlippage = string;
