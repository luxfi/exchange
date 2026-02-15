/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The status of the order. Note that all of these are final states with the exception of Open, meaning that no further state changes will occur.
 * Open - order is not yet filled by a filler.
 * Expired - order has expired without being filled and is no longer fillable.
 * Error - a catchall for other final states which are not otherwise specified, where the order will not be filled.
 * Cancelled - order is cancelled. Note that to cancel an order, a new order must be placed with the same nonce as the prior open order and it must be placed within the same block as the original order.
 * Filled - order is filled.
 * Insufficient-funds - the swapper (you) do not have enough funds for the order to be completed and the order is cancelled and will not be filled.
 */
export enum OrderStatus {
    OPEN = 'open',
    EXPIRED = 'expired',
    ERROR = 'error',
    CANCELLED = 'cancelled',
    FILLED = 'filled',
    INSUFFICIENT_FUNDS = 'insufficient-funds',
    /** @deprecated Deprecation flag added via modifyTradingApiTypes.mts in order to not break existing code. */
    UNVERIFIED = "unverified"
}
