import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { DSTokenInterface, DSTokenInterfaceInterface } from "../DSTokenInterface";
export declare class DSTokenInterface__factory {
    static readonly abi: readonly [{
        readonly type: "constructor";
        readonly inputs: readonly [];
        readonly stateMutability: "nonpayable";
    }, {
        readonly type: "function";
        readonly name: "allowance";
        readonly inputs: readonly [{
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly name: "spender";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
    }, {
        readonly type: "function";
        readonly name: "approve";
        readonly inputs: readonly [{
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
    }, {
        readonly type: "function";
        readonly name: "balanceOf";
        readonly inputs: readonly [{
            readonly name: "who";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
    }, {
        readonly type: "function";
        readonly name: "balanceOfInvestor";
        readonly inputs: readonly [{
            readonly name: "_id";
            readonly type: "string";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
    }, {
        readonly type: "function";
        readonly name: "burn";
        readonly inputs: readonly [{
            readonly name: "_who";
            readonly type: "address";
        }, {
            readonly name: "_value";
            readonly type: "uint256";
        }, {
            readonly name: "_reason";
            readonly type: "string";
        }];
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
    }, {
        readonly type: "function";
        readonly name: "getVersion";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256[]";
        }];
        readonly stateMutability: "view";
    }, {
        readonly type: "function";
        readonly name: "getWalletAt";
        readonly inputs: readonly [{
            readonly name: "_index";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
    }, {
        readonly type: "function";
        readonly name: "isPaused";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
    }, {
        readonly type: "function";
        readonly name: "issueTokens";
        readonly inputs: readonly [{
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly name: "_value";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
    }, {
        readonly type: "function";
        readonly name: "issueTokensCustom";
        readonly inputs: readonly [{
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly name: "_value";
            readonly type: "uint256";
        }, {
            readonly name: "_issuanceTime";
            readonly type: "uint256";
        }, {
            readonly name: "_valueLocked";
            readonly type: "uint256";
        }, {
            readonly name: "_reason";
            readonly type: "string";
        }, {
            readonly name: "_releaseTime";
            readonly type: "uint64";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
    }, {
        readonly type: "function";
        readonly name: "preTransferCheck";
        readonly inputs: readonly [{
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly name: "_value";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [{
            readonly name: "code";
            readonly type: "uint256";
        }, {
            readonly name: "reason";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
    }, {
        readonly type: "function";
        readonly name: "seize";
        readonly inputs: readonly [{
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly name: "_value";
            readonly type: "uint256";
        }, {
            readonly name: "_reason";
            readonly type: "string";
        }];
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
    }, {
        readonly type: "function";
        readonly name: "setCap";
        readonly inputs: readonly [{
            readonly name: "_cap";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
    }, {
        readonly type: "function";
        readonly name: "totalIssued";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
    }, {
        readonly type: "function";
        readonly name: "totalSupply";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
    }, {
        readonly type: "function";
        readonly name: "transfer";
        readonly inputs: readonly [{
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
    }, {
        readonly type: "function";
        readonly name: "transferFrom";
        readonly inputs: readonly [{
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
    }, {
        readonly type: "function";
        readonly name: "walletCount";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
    }, {
        readonly type: "event";
        readonly name: "Approval";
        readonly inputs: readonly [{
            readonly name: "owner";
            readonly type: "address";
            readonly indexed: true;
        }, {
            readonly name: "spender";
            readonly type: "address";
            readonly indexed: true;
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly indexed: false;
        }];
        readonly anonymous: false;
    }, {
        readonly type: "event";
        readonly name: "Burn";
        readonly inputs: readonly [{
            readonly name: "burner";
            readonly type: "address";
            readonly indexed: true;
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly indexed: false;
        }, {
            readonly name: "reason";
            readonly type: "string";
            readonly indexed: false;
        }];
        readonly anonymous: false;
    }, {
        readonly type: "event";
        readonly name: "Issue";
        readonly inputs: readonly [{
            readonly name: "to";
            readonly type: "address";
            readonly indexed: true;
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly indexed: false;
        }, {
            readonly name: "valueLocked";
            readonly type: "uint256";
            readonly indexed: false;
        }];
        readonly anonymous: false;
    }, {
        readonly type: "event";
        readonly name: "Seize";
        readonly inputs: readonly [{
            readonly name: "from";
            readonly type: "address";
            readonly indexed: true;
        }, {
            readonly name: "to";
            readonly type: "address";
            readonly indexed: true;
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly indexed: false;
        }, {
            readonly name: "reason";
            readonly type: "string";
            readonly indexed: false;
        }];
        readonly anonymous: false;
    }, {
        readonly type: "event";
        readonly name: "Transfer";
        readonly inputs: readonly [{
            readonly name: "from";
            readonly type: "address";
            readonly indexed: true;
        }, {
            readonly name: "to";
            readonly type: "address";
            readonly indexed: true;
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly indexed: false;
        }];
        readonly anonymous: false;
    }, {
        readonly type: "event";
        readonly name: "WalletAdded";
        readonly inputs: readonly [{
            readonly name: "wallet";
            readonly type: "address";
            readonly indexed: false;
        }];
        readonly anonymous: false;
    }, {
        readonly type: "event";
        readonly name: "WalletRemoved";
        readonly inputs: readonly [{
            readonly name: "wallet";
            readonly type: "address";
            readonly indexed: false;
        }];
        readonly anonymous: false;
    }];
    static createInterface(): DSTokenInterfaceInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): DSTokenInterface;
}
