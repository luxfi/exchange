/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The overall status of the plan execution. ACTIVE means the plan is ready to begin (all steps NOT_READY). AWAITING_ACTION means at least one step requires user action. IN_PROGRESS means at least one step is executing. COMPLETED means all steps have been successfully executed. FAILED means the plan cannot be completed.
 */
export enum PlanStatus {
    ACTIVE = 'ACTIVE',
    AWAITING_ACTION = 'AWAITING_ACTION',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}
