import { Currency } from '@uniswap/sdk-core';
import { Route } from '../entities/route';
export declare type PathKey = {
    intermediateCurrency: string;
    fee: number;
    tickSpacing: number;
    hooks: string;
    hookData: string;
};
export declare const encodeRouteToPath: (route: Route<Currency, Currency>, exactOutput?: boolean | undefined) => PathKey[];
