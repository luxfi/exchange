/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The status of an individual step. NOT_READY means prerequisites are not met. AWAITING_ACTION means the step is ready for user action. IN_PROGRESS means the step is being executed. COMPLETE means the step finished successfully. STEP_ERROR means the step failed.
 */
export enum PlanStepStatus {
    NOT_READY = 'NOT_READY',
    AWAITING_ACTION = 'AWAITING_ACTION',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETE = 'COMPLETE',
    STEP_ERROR = 'STEP_ERROR',
}
