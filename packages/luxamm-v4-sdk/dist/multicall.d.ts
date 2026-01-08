import { Interface } from '@ethersproject/abi';
export declare abstract class Multicall {
    static INTERFACE: Interface;
    /**
     * Cannot be constructed.
     */
    private constructor();
    static encodeMulticall(calldataList: string | string[]): string;
    static decodeMulticall(encodedCalldata: string): string[];
}
