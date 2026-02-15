/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BridgeQuote } from './BridgeQuote';
import type { ChainedQuote } from './ChainedQuote';
import type { ClassicQuote } from './ClassicQuote';
import type { DutchQuoteV2 } from './DutchQuoteV2';
import type { DutchQuoteV3 } from './DutchQuoteV3';
import type { PriorityQuote } from './PriorityQuote';
import type { WrapUnwrapQuote } from './WrapUnwrapQuote';
export type Quote = (ClassicQuote | WrapUnwrapQuote | DutchQuoteV2 | DutchQuoteV3 | BridgeQuote | PriorityQuote | ChainedQuote);

