import { V4Planner } from './v4Planner';
import { Pool } from '../entities';
import { BigintIsh, Currency } from '@uniswap/sdk-core';
export declare class V4PositionPlanner extends V4Planner {
    addMint(pool: Pool, tickLower: number, tickUpper: number, liquidity: BigintIsh, amount0Max: BigintIsh, amount1Max: BigintIsh, owner: string, hookData?: string): void;
    addIncrease(tokenId: BigintIsh, liquidity: BigintIsh, amount0Max: BigintIsh, amount1Max: BigintIsh, hookData?: string): void;
    addDecrease(tokenId: BigintIsh, liquidity: BigintIsh, amount0Min: BigintIsh, amount1Min: BigintIsh, hookData?: string): void;
    addBurn(tokenId: BigintIsh, amount0Min: BigintIsh, amount1Min: BigintIsh, hookData?: string): void;
    addSettlePair(currency0: Currency, currency1: Currency): void;
    addTakePair(currency0: Currency, currency1: Currency, recipient: string): void;
    addSweep(currency: Currency, to: string): void;
}
