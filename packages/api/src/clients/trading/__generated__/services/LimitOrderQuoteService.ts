/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LimitOrderQuoteRequest } from '../models/LimitOrderQuoteRequest';
import type { LimitOrderQuoteResponse } from '../models/LimitOrderQuoteResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LimitOrderQuoteService {
    /**
     * Get a limit order quote
     * Get a quote for a limit order according to the provided configuration.
     * @returns LimitOrderQuoteResponse Limit Order Quote request successful.
     * @throws ApiError
     */
    public static getLimitOrderQuote({
        requestBody,
    }: {
        requestBody?: LimitOrderQuoteRequest,
    }): CancelablePromise<LimitOrderQuoteResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/limit_order_quote',
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
