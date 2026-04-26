/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Curve } from './Curve';
import type { inputToken } from './inputToken';
import type { startAmount } from './startAmount';
export type DutchInputV3 = {
    startAmount: startAmount;
    maxAmount: string;
    adjustmentPerGweiBaseFee: string;
    curve: Curve;
    token: inputToken;
};

