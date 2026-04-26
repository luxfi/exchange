/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IndicativeQuoteToken } from './IndicativeQuoteToken';
import type { RequestId } from './RequestId';
import type { TradeType } from './TradeType';
export type IndicativeQuoteResponse = {
    requestId: RequestId;
    input: IndicativeQuoteToken;
    output: IndicativeQuoteToken;
    type: TradeType;
};

