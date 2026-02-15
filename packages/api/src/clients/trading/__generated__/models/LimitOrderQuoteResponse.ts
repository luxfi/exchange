/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DutchQuote } from './DutchQuote';
import type { NullablePermit } from './NullablePermit';
import type { RequestId } from './RequestId';
export type LimitOrderQuoteResponse = {
    requestId: RequestId;
    quote: DutchQuote;
    routing: LimitOrderQuoteResponse.routing;
    permitData: NullablePermit;
};
export namespace LimitOrderQuoteResponse {
    export enum routing {
        LIMIT_ORDER = 'LIMIT_ORDER',
    }
}

