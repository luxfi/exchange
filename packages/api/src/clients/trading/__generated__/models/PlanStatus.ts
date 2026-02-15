/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The overall status of the plan execution. ACTIVE means the plan is ready to begin. IN_PROGRESS means at least one step has been started. COMPLETED means all steps have been successfully executed. FAILED means the plan cannot be completed.
 */
export enum PlanStatus {
    ACTIVE = 'ACTIVE',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}
