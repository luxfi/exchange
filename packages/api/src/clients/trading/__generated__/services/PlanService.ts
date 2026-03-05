/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePlanRequest } from '../models/CreatePlanRequest';
import type { PlanResponse } from '../models/PlanResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlanService {
    /**
     * Create an execution plan
     * Creates a multi-step execution plan for chained transactions. The plan breaks down complex multi-chain or multi-transaction flows into sequential steps that can be executed by the client. Each step includes the method (transaction, message signature, or batch calls), payload, and current status. The response includes the current step index to track progress through the plan.
     * @returns PlanResponse Create plan successful.
     * @throws ApiError
     */
    public static createPlan({
        requestBody,
    }: {
        requestBody?: CreatePlanRequest,
    }): CancelablePromise<PlanResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/plan',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `RequestValidationError, Bad Input`,
                401: `UnauthorizedError eg. Account is blocked.`,
                404: `ResourceNotFound eg. No quotes available or Gas fee/price not available`,
                429: `Ratelimited`,
                500: `Unexpected error`,
                504: `Request duration limit reached.`,
            },
        });
    }
    /**
     * Get an execution plan
     * Retrieves an existing execution plan by its ID. Returns the full plan with current status and all steps. If forceRefresh is set to true, the plan will be refreshed to check for any updates to step statuses. Note: Completed plans cannot be refreshed.
     * @returns PlanResponse Get plan successful.
     * @throws ApiError
     */
    public static getPlan({
        planId,
        forceRefresh,
    }: {
        /**
         * The unique identifier of the plan to retrieve.
         */
        planId: string,
        /**
         * Whether to force refresh the plan status. Defaults to false. Completed plans cannot be refreshed.
         */
        forceRefresh?: boolean,
    }): CancelablePromise<PlanResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/plan/{planId}',
            path: {
                'planId': planId,
            },
            query: {
                'forceRefresh': forceRefresh,
            },
            errors: {
                400: `RequestValidationError, Bad Input`,
                401: `UnauthorizedError eg. Account is blocked.`,
                404: `ResourceNotFound eg. No quotes available or Gas fee/price not available`,
                422: `UnprocessableEntity eg. Plan is already completed and cannot be updated.`,
                429: `Ratelimited`,
                500: `Unexpected error`,
                504: `Request duration limit reached.`,
            },
        });
    }
}
