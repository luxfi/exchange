/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The urgency impacts the estimated gas price of the transaction. The higher the urgency, the higher the gas price, and the faster the transaction is likely to be selected from the mempool. The default value is `urgent`.
 */
export enum Urgency {
    NORMAL = 'normal',
    FAST = 'fast',
    URGENT = 'urgent',
}
