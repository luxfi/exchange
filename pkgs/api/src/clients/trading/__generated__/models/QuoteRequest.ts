/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AutoSlippage } from './AutoSlippage';
import type { ChainId } from './ChainId';
import type { generatePermitAsTransaction } from './generatePermitAsTransaction';
import type { HooksOptions } from './HooksOptions';
import type { inputToken } from './inputToken';
import type { IntegratorFee } from './IntegratorFee';
import type { outputToken } from './outputToken';
import type { PermitAmount } from './PermitAmount';
import type { Protocols } from './Protocols';
import type { RoutingPreference } from './RoutingPreference';
import type { senderWalletAddress } from './senderWalletAddress';
import type { slippageTolerance } from './slippageTolerance';
import type { SpreadOptimization } from './SpreadOptimization';
import type { tokenAmount } from './tokenAmount';
import type { TradeType } from './TradeType';
import type { Urgency } from './Urgency';
export type QuoteRequest = {
    type: TradeType;
    amount: tokenAmount;
    tokenInChainId: ChainId;
    tokenOutChainId: ChainId;
    tokenIn: inputToken;
    tokenOut: outputToken;
    generatePermitAsTransaction?: generatePermitAsTransaction;
    swapper: senderWalletAddress;
    slippageTolerance?: slippageTolerance;
    autoSlippage?: AutoSlippage;
    routingPreference?: RoutingPreference;
    protocols?: Protocols;
    hooksOptions?: HooksOptions;
    spreadOptimization?: SpreadOptimization;
    urgency?: Urgency;
    permitAmount?: PermitAmount;
    /**
     * Optional integrator fee configuration. When provided, the specified fee is applied to the swap instead of the default partner fee service. Only one fee entry is currently supported.
     */
    integratorFees?: Array<IntegratorFee>;
};

