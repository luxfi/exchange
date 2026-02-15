/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Err404 = {
    errorCode?: Err404.errorCode;
    detail?: string;
};
export namespace Err404 {
    export enum errorCode {
        RESOURCE_NOT_FOUND = 'ResourceNotFound',
        QUOTE_AMOUNT_TOO_LOW_ERROR = 'QuoteAmountTooLowError',
        TOKEN_BALANCE_NOT_AVAILABLE = 'TokenBalanceNotAvailable',
        INSUFFICIENT_BALANCE = 'InsufficientBalance',
    }
}

