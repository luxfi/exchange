/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RequestId } from './RequestId';
import type { UniswapXOrder } from './UniswapXOrder';
export type GetOrdersResponse = {
    requestId: RequestId;
    orders: Array<UniswapXOrder>;
    cursor?: string;
};

