/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChainId } from './ChainId';
import type { inputToken } from './inputToken';
import type { outputToken } from './outputToken';
import type { PlanStepType } from './PlanStepType';
import type { slippageTolerance } from './slippageTolerance';
/**
 * A truncated representation of a plan step containing only routing information.
 */
export type TruncatedPlanStep = {
    stepType: PlanStepType;
    tokenIn?: inputToken;
    tokenInChainId?: ChainId;
    tokenOut?: outputToken;
    tokenOutChainId?: ChainId;
    slippage?: slippageTolerance;
};

