/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QuoteRequest } from '../models/QuoteRequest';
import type { QuoteResponse } from '../models/QuoteResponse';
import type { UniversalRouterVersion } from '../models/UniversalRouterVersion';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class QuoteService {
    /**
     * Get a quote
     * Requests a quote according to the specified swap parameters. This endpoint may be used to get a quote for a swap, a bridge, or a wrap/unwrap. The resulting response includes a quote for the swap and the proposed route by which the quote was achieved. The response will also include estimated gas fees for the proposed quote route. If the proposed route is via a Uniswap Protocol pool, the response may include a permit2 message for the swapper to sign prior to making a /swap request. The proposed route will also be simulated. If the simulation fails, the response will include an error message or `txFailureReason`.
     *
     * Certain routing options may be whitelisted by the requestor through the use of the `protocols` field. Further, the requestor may ask for the best price route or for the fastest price route through the 'routingPreference' field. Note that the fastest price route refers to the speed with which a quote is returned, not the number of transactions that may be required to get from the input token and chain to the output token and chain. Further note that all `routingPreference` values except for `FASTEST` and `BEST_PRICE` are deprecated. For more information on the `protocols` and `routingPreference` fields, see the [Token Trading Workflow](/guides/swapping) explanation of Swap Routing.
     *
     * API integrators using this API for the benefit of customer end users may request a service fee be taken from the output token and deposited to a fee collection address. To request this, please reach out to your Uniswap Labs contact. This optional fee is associated to the API key and is always taken from the output token. Note if there is a fee and the `type` is `EXACT_INPUT`, the output amount quoted will **not** include the fee subtraction. If there is a fee and the `type` is `EXACT_OUTPUT`, the input amount quoted will **not** include the fee addition. Instead, in both cases, the fee will be recorded in the `portionBips` and `portionAmount` fields.
     * @returns QuoteResponse Quote request successful.
     * @throws ApiError
     */
    public static aggregatorQuote({
        xUniversalRouterVersion,
        requestBody,
    }: {
        /**
         * The version of the Universal Router to use for the swap journey. *MUST* be consistent throughout the API calls.
         */
        xUniversalRouterVersion?: UniversalRouterVersion,
        requestBody?: QuoteRequest,
    }): CancelablePromise<QuoteResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/quote',
            headers: {
                'x-universal-router-version': xUniversalRouterVersion,
            },
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
