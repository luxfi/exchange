import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { MockDSTokenInterface, MockDSTokenInterfaceInterface } from "../MockDSTokenInterface";
type MockDSTokenInterfaceConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class MockDSTokenInterface__factory extends ContractFactory {
    constructor(...args: MockDSTokenInterfaceConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<MockDSTokenInterface>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): MockDSTokenInterface;
    connect(signer: Signer): MockDSTokenInterface__factory;
    static readonly bytecode = "0x6080604052348015600e575f80fd5b506103ff8061001c5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c80631f227b4314610038578063bb01f2b614610062575b5f80fd5b61004b610046366004610144565b610077565b60405161005992919061017e565b60405180910390f35b6100756100703660046101ce565b610114565b005b5f60605f54600180805461008a9061028b565b80601f01602080910402602001604051908101604052809291908181526020018280546100b69061028b565b80156101015780601f106100d857610100808354040283529160200191610101565b820191905f5260205f20905b8154815290600101906020018083116100e457829003601f168201915b5050505050905091509150935093915050565b5f8290556001610124828261030e565b505050565b80356001600160a01b038116811461013f575f80fd5b919050565b5f805f60608486031215610156575f80fd5b61015f84610129565b925061016d60208501610129565b929592945050506040919091013590565b828152604060208201525f82518060408401528060208501606085015e5f606082850101526060601f19601f8301168401019150509392505050565b634e487b7160e01b5f52604160045260245ffd5b5f80604083850312156101df575f80fd5b82359150602083013567ffffffffffffffff8111156101fc575f80fd5b8301601f8101851361020c575f80fd5b803567ffffffffffffffff811115610226576102266101ba565b604051601f8201601f19908116603f0116810167ffffffffffffffff81118282101715610255576102556101ba565b60405281815282820160200187101561026c575f80fd5b816020840160208301375f602083830101528093505050509250929050565b600181811c9082168061029f57607f821691505b6020821081036102bd57634e487b7160e01b5f52602260045260245ffd5b50919050565b601f82111561012457805f5260205f20601f840160051c810160208510156102e85750805b601f840160051c820191505b81811015610307575f81556001016102f4565b5050505050565b815167ffffffffffffffff811115610328576103286101ba565b61033c81610336845461028b565b846102c3565b6020601f82116001811461036e575f83156103575750848201515b5f19600385901b1c1916600184901b178455610307565b5f84815260208120601f198516915b8281101561039d578785015182556020948501946001909201910161037d565b50848210156103ba57868401515f19600387901b60f8161c191681555b50505050600190811b0190555056fea2646970667358221220e734d10e03cf41c6658f4881eba4b14ae7215afae9f46f60cca70ae92b747bbd64736f6c634300081a0033";
    static readonly abi: readonly [{
        readonly type: "function";
        readonly name: "preTransferCheck";
        readonly inputs: readonly [{
            readonly name: "from";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "to";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "";
            readonly type: "string";
            readonly internalType: "string";
        }];
        readonly stateMutability: "view";
    }, {
        readonly type: "function";
        readonly name: "setPreTransferCheckResponse";
        readonly inputs: readonly [{
            readonly name: "code";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "reason";
            readonly type: "string";
            readonly internalType: "string";
        }];
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
    }];
    static createInterface(): MockDSTokenInterfaceInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): MockDSTokenInterface;
}
export {};
