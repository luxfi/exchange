/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BridgeQuote } from './BridgeQuote';
import type { ClassicQuote } from './ClassicQuote';
import type { deadline } from './deadline';
import type { Permit } from './Permit';
import type { SwapSafetyMode } from './SwapSafetyMode';
import type { Urgency } from './Urgency';
import type { WrapUnwrapQuote } from './WrapUnwrapQuote';
import { GasStrategy } from "../../types";

/**
 * The parameters **signature** and **permitData** should only be included if *permitData* was returned from **quote**.
 */
export type CreateSwapRequest = {
    quote: (ClassicQuote | WrapUnwrapQuote | BridgeQuote);
    /**
     * The signed permit.
     */
    signature?: string;
    /**
     * Use `refreshGasPrice` instead.
     * @deprecated
     */
    includeGasInfo?: boolean;
    /**
     * If true, the gas price will be re-fetched from the network.
     */
    refreshGasPrice?: boolean;
    /**
     * If true, the transaction will be simulated. If the simulation results on an onchain error, endpoint will return an error.
     */
    simulateTransaction?: boolean;
    permitData?: Permit;
    safetyMode?: SwapSafetyMode;
    deadline?: deadline;
    urgency?: Urgency;
    gasStrategies?: GasStrategy[];
};

