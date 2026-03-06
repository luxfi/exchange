/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The `routingPreference` specifies the preferred strategy to determine the quote. If the `routingPreference` is `BEST_PRICE`, then the quote will propose a route through the specified whitelisted protocols (or all, if none are specified) that provides the best price. When the `routingPreference` is `FASTEST`, the quote will propose the first route which is found to complete the swap.
 */
export enum RoutingPreference {
    BEST_PRICE = 'BEST_PRICE',
    FASTEST = 'FASTEST',
    ROUTING_CLASSIC = 'ROUTING_CLASSIC',
    ROUTING_LUXX_V2 = 'ROUTING_LUXX_V2',
    V3_ONLY = 'V3_ONLY',
    V2_ONLY = 'V2_ONLY',
    BEST_PRICE_V2 = 'BEST_PRICE_V2',
}
