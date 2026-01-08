import { ChainId } from "@uniswap/sdk-core";
import { constants } from "ethers";
export var NativeAssets;
(function (NativeAssets) {
    NativeAssets["MATIC"] = "MATIC";
    NativeAssets["BNB"] = "BNB";
    NativeAssets["AVAX"] = "AVAX";
    NativeAssets["ETH"] = "ETH";
})(NativeAssets || (NativeAssets = {}));
function nativeCurrencyAddressString(chainId) {
    switch (chainId) {
        case ChainId.POLYGON:
            return NativeAssets.MATIC;
        case ChainId.BNB:
            return NativeAssets.BNB;
        case ChainId.AVALANCHE:
            return NativeAssets.AVAX;
        default:
            return NativeAssets.ETH;
    }
}
export function areCurrenciesEqual(currency, address, chainId) {
    if (currency.chainId !== chainId)
        return false;
    if (currency.isNative) {
        return (address === constants.AddressZero ||
            address === nativeCurrencyAddressString(chainId));
    }
    return currency.address.toLowerCase() === (address === null || address === void 0 ? void 0 : address.toLowerCase());
}
//# sourceMappingURL=utils.js.map