/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PoolInformation } from './PoolInformation';
import type { RequestId } from './RequestId';
export type PoolInfoResponse = {
    requestId?: RequestId;
    /**
     * Array of pool information objects.
     */
    pools?: Array<PoolInformation>;
    pageSize?: number;
    currentPage?: number;
};

