/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TokenInRoute } from './TokenInRoute';
/**
 * The remaining reserve of this token in the pool.
 */
export type V2Reserve = {
    token?: TokenInRoute;
    /**
     * The quantity of this token remaining in the pool, specified in the base units of the token.
     */
    quotient?: string;
};

