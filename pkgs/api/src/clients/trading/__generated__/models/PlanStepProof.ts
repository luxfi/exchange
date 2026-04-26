/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TransactionHash } from './TransactionHash';
/**
 * Proof of execution for a plan step, provided after the step is completed.
 */
export type PlanStepProof = {
    txHash?: TransactionHash;
    /**
     * The signature for a message signing step.
     */
    signature?: string;
    /**
     * The order ID for a gasless order step.
     */
    orderId?: string;
};

