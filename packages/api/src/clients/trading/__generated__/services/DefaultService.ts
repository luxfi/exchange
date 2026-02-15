/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlanResponse } from '../models/PlanResponse';
import type { UpdatePlanRequest } from '../models/UpdatePlanRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Update an existing plan with step proofs
     * Updates an existing execution plan by submitting proof of completed plan steps (transaction hashes or signatures). The endpoint retrieves the existing plan, attaches proofs to specified steps, verifies the proofs, and potentially regenerates remaining steps if needed. Returns the full updated plan with current status. Note: Order IDs are not accepted in requests; they are system-generated after receiving a signature.
     * @returns PlanResponse Update plan successful.
     * @throws ApiError
     */
    public static updatePlan({
        planId,
        requestBody,
    }: {
        /**
         * The unique identifier of the plan to update.
         */
        planId: string,
        requestBody?: UpdatePlanRequest,
    }): CancelablePromise<PlanResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/plan/{planId}',
            path: {
                'planId': planId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `RequestValidationError, Bad Input`,
                401: `UnauthorizedError eg. Account is blocked.`,
                404: `ResourceNotFound eg. No quotes available or Gas fee/price not available`,
                419: `Ratelimited`,
                422: `UnprocessableEntity eg. Plan is already completed and cannot be updated.`,
                500: `Unexpected error`,
                504: `Request duration limit reached.`,
            },
        });
    }
}
