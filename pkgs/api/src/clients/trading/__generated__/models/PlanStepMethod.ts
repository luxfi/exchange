/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The execution method for the step. SEND_TX is a standard transaction. SIGN_MSG is for signing a message (e.g., permit). SEND_CALLS is for batch transaction execution (EIP-5792).
 */
export enum PlanStepMethod {
    SEND_TX = 'SEND_TX',
    SIGN_MSG = 'SIGN_MSG',
    SEND_CALLS = 'SEND_CALLS',
}
