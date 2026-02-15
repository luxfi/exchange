/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BridgeQuote } from './BridgeQuote';
import type { ClassicQuote } from './ClassicQuote';
import type { deadline } from './deadline';
import type { NullablePermit } from './NullablePermit';
import type { Urgency } from './Urgency';
import type { WrapUnwrapQuote } from './WrapUnwrapQuote';
export type CreateSwap5792Request = {
    quote: (ClassicQuote | WrapUnwrapQuote | BridgeQuote);
    permitData?: NullablePermit;
    deadline?: deadline;
    urgency?: Urgency;
};

