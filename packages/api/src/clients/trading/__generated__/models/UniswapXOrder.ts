/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChainId } from './ChainId';
import type { CosignerData } from './CosignerData';
import type { encodedOrder } from './encodedOrder';
import type { nonce } from './nonce';
import type { orderId } from './orderId';
import type { OrderInput } from './OrderInput';
import type { OrderOutput } from './OrderOutput';
import type { OrderStatus } from './OrderStatus';
import type { OrderType } from './OrderType';
import type { quoteId } from './quoteId';
import type { receiverWalletAddress } from './receiverWalletAddress';
import type { SettledAmount } from './SettledAmount';
import type { TransactionHash } from './TransactionHash';
export type UniswapXOrder = {
    type: OrderType;
    encodedOrder: encodedOrder;
    signature: string;
    nonce: nonce;
    orderStatus: OrderStatus;
    orderId: orderId;
    chainId: ChainId;
    quoteId?: quoteId;
    swapper?: receiverWalletAddress;
    txHash?: TransactionHash;
    input?: OrderInput;
    outputs?: Array<OrderOutput>;
    settledAmounts?: Array<SettledAmount>;
    cosignature?: string;
    cosignerData?: CosignerData;
};

