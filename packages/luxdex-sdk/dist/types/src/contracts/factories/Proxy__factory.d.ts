import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { Proxy, ProxyInterface } from "../Proxy";
type ProxyConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class Proxy__factory extends ContractFactory {
    constructor(...args: ProxyConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<Proxy>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): Proxy;
    connect(signer: Signer): Proxy__factory;
    static readonly bytecode = "0x6080604052348015600e575f80fd5b505f80546001600160a01b031916331790556102b38061002d5f395ff3fe608060405234801561000f575f80fd5b506004361061004a575f3560e01c806313af4035146100bd578063776d1a01146100d05780638da5cb5b146100e3578063d4b8399214610111575b6001546001600160a01b0316806100995760405162461bcd60e51b815260206004820152600e60248201526d15185c99d95d081b9bdd081cd95d60921b60448201526064015b60405180910390fd5b604051365f82375f803683855af43d805f843e8180156100b7578184f35b8184fd5b005b6100bb6100cb366004610250565b610124565b6100bb6100de366004610250565b6101bd565b5f546100f5906001600160a01b031681565b6040516001600160a01b03909116815260200160405180910390f35b6001546100f5906001600160a01b031681565b5f546001600160a01b031633146101695760405162461bcd60e51b81526020600482015260096024820152682737ba1037bbb732b960b91b6044820152606401610090565b5f80546001600160a01b0319166001600160a01b0383169081179091556040519081527fe543d3a077035cec99b732bad2c4cf1c0fdee02ddf561ae543106ccc31cf35a3906020015b60405180910390a150565b5f546001600160a01b031633146102025760405162461bcd60e51b81526020600482015260096024820152682737ba1037bbb732b960b91b6044820152606401610090565b600180546001600160a01b0319166001600160a01b0383169081179091556040519081527ff1b1e874978309afba903baec19abf568b0337fcedc05dde58cfea25ec25b94d906020016101b2565b5f60208284031215610260575f80fd5b81356001600160a01b0381168114610276575f80fd5b939250505056fea26469706673582212209927617c4c48e469a09ba0687a3588e871b87639ce58ca1e9834cfa89ff06e5464736f6c634300081a0033";
    static readonly abi: readonly [{
        readonly type: "constructor";
        readonly inputs: readonly [];
        readonly stateMutability: "nonpayable";
    }, {
        readonly type: "fallback";
        readonly stateMutability: "nonpayable";
    }, {
        readonly type: "function";
        readonly name: "owner";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "address";
            readonly internalType: "address";
        }];
        readonly stateMutability: "view";
    }, {
        readonly type: "function";
        readonly name: "setOwner";
        readonly inputs: readonly [{
            readonly name: "_owner";
            readonly type: "address";
            readonly internalType: "address";
        }];
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
    }, {
        readonly type: "function";
        readonly name: "setTarget";
        readonly inputs: readonly [{
            readonly name: "_target";
            readonly type: "address";
            readonly internalType: "address";
        }];
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
    }, {
        readonly type: "function";
        readonly name: "target";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "address";
            readonly internalType: "address";
        }];
        readonly stateMutability: "view";
    }, {
        readonly type: "event";
        readonly name: "ProxyOwnerChanged";
        readonly inputs: readonly [{
            readonly name: "owner";
            readonly type: "address";
            readonly indexed: false;
            readonly internalType: "address";
        }];
        readonly anonymous: false;
    }, {
        readonly type: "event";
        readonly name: "ProxyTargetSet";
        readonly inputs: readonly [{
            readonly name: "target";
            readonly type: "address";
            readonly indexed: false;
            readonly internalType: "address";
        }];
        readonly anonymous: false;
    }];
    static createInterface(): ProxyInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): Proxy;
}
export {};
