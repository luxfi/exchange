/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChainedQuote } from './ChainedQuote';
export type CreatePlanRequest = {
    /**
     * The routing type for the plan. Currently only CHAINED is supported for multi-step execution plans.
     */
    routing: CreatePlanRequest.routing;
    quote: ChainedQuote;
};
export namespace CreatePlanRequest {
    /**
     * The routing type for the plan. Currently only CHAINED is supported for multi-step execution plans.
     */
    export enum routing {
        CHAINED = 'CHAINED',
    }
}

