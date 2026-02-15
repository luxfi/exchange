/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WalletCheckDelegationRequestBody } from '../models/WalletCheckDelegationRequestBody';
import type { WalletCheckDelegationResponseBody } from '../models/WalletCheckDelegationResponseBody';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WalletCheckDelegationService {
    /**
     * Get wallet delegation info
     * Gets the current delegation status and message for a smart contract wallet across different chains. Returns delegation information for each chain ID in the request.
     * @returns WalletCheckDelegationResponseBody Wallet delegation info request successful.
     * @throws ApiError
     */
    public static walletCheckDelegation({
        requestBody,
    }: {
        requestBody?: WalletCheckDelegationRequestBody,
    }): CancelablePromise<WalletCheckDelegationResponseBody> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/wallet/check_delegation',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `RequestValidationError, Bad Input`,
                401: `UnauthorizedError eg. Account is blocked.`,
                404: `ResourceNotFound eg. No quotes available or Gas fee/price not available`,
                419: `Ratelimited`,
                500: `Unexpected error`,
                504: `Request duration limit reached.`,
            },
        });
    }
}
