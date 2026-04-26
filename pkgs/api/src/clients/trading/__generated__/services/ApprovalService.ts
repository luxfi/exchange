/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApprovalRequest } from '../models/ApprovalRequest';
import type { ApprovalResponse } from '../models/ApprovalResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ApprovalService {
    /**
     * Check if token approval is required
     * Allows the requestor to check if the `walletAddress` has the required approval to transact the `token` up to the `amount` specified. If the `walletAddress` does not have the required approval, the response will include a transaction to approve the token spend. If the `walletAddress` has the required approval, the response will return the approval with a `null` value. If the parameter `includeGasInfo` is set to `true` and an approval is needed, then the response will include both the transaction and the gas fee for the approval transaction.
     *
     * Certain tokens may require that approval be reset before approving a new spend amount. If this condition is detected for the `walletAddress` and `token`, the response will include the necessary approval cancellation in the `cancel` paragraph. When `cancel` is not applicable, the paragraph will have a `null` value.
     * @returns ApprovalResponse Check approval successful.
     * @throws ApiError
     */
    public static checkApproval({
        xPermit2Disabled = false,
        requestBody,
    }: {
        /**
         * Disables the Permit2 approval flow. When set to `true`, `permitData` is returned as `null` and the header is forwarded to the routing layer for correct gas simulation against the Proxy Universal Router contract. When `false` or omitted, the standard Permit2 approval flow is used. This header is intended for integrators whose infrastructure uses a direct approval-then-swap pattern without Permit2.
         */
        xPermit2Disabled?: boolean,
        requestBody?: ApprovalRequest,
    }): CancelablePromise<ApprovalResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/check_approval',
            headers: {
                'x-permit2-disabled': xPermit2Disabled,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `RequestValidationError, Bad Input`,
                401: `UnauthorizedError eg. Account is blocked.`,
                404: `ResourceNotFound eg. Token allowance not found or Gas info not found.`,
                429: `Ratelimited`,
                500: `Unexpected error`,
                504: `Request duration limit reached.`,
            },
        });
    }
}
