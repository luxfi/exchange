/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DEXOrder } from './DEXOrder';
import type { RequestId } from './RequestId';
export type GetOrdersResponse = {
    requestId: RequestId;
    orders: Array<DEXOrder>;
    cursor?: string;
};

