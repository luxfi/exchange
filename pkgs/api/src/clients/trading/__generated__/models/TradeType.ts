/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The handling of the `amount` field. `EXACT_INPUT` means the requester will send the specified `amount` of input tokens and get a quote with a variable quantity of output tokens. `EXACT_OUTPUT` means the requester will receive the specified `amount` of output tokens and get a quote with a variable quantity of input tokens.
 */
export enum TradeType {
    EXACT_INPUT = 'EXACT_INPUT',
    EXACT_OUTPUT = 'EXACT_OUTPUT',
}
