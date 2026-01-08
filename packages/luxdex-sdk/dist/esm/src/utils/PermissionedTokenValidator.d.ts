import { Provider } from "@ethersproject/providers";
import { ChainId } from "@uniswap/sdk-core";
export declare class PermissionedTokenValidator {
    /**
     * Checks if a token is a permissioned token
     * @param tokenAddress The address of the token
     * @returns True if the token is a permissioned token, false otherwise
     */
    static isPermissionedToken(tokenAddress: string, chainId: ChainId): boolean;
    /**
     * Checks if a transfer would be allowed for a permissioned token
     * @param provider The provider to use for the view call
     * @param tokenAddress The address of the permissioned token
     * @param from The sender's address
     * @param to The recipient's address
     * @param value The amount to transfer (in base units)
     * @returns True if the token is not a permissioned token or the transfer is
     * allowed, false otherwise
     * @throws Will throw an exception if there is an error with the provider
     */
    static preTransferCheck(provider: Provider, tokenAddress: string, from: string, to: string, value: string): Promise<boolean>;
}
