/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DutchQuoteV2 } from './DutchQuoteV2';
import type { DutchQuoteV3 } from './DutchQuoteV3';
import type { PriorityQuote } from './PriorityQuote';
import type { Routing } from './Routing';
export type OrderRequest = {
    /**
     * The signed permit.
     */
    signature: string;
    quote: (DutchQuoteV2 | DutchQuoteV3 | PriorityQuote);
    routing?: Routing;
};

