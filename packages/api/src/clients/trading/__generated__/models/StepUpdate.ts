/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TransactionHash } from './TransactionHash';
/**
 * Represents a single step update with proof. Note: orderId is not accepted in update requests; it is system-generated after receiving a signature.
 */
export type StepUpdate = {
    /**
     * The index of the step being updated (0-based).
     */
    stepIndex: number;
    /**
     * Proof of step completion. Must provide either txHash or signature.
     */
    proof: {
        txHash?: TransactionHash;
        /**
         * The signature for a message signing step.
         */
        signature?: string;
    };
};

