import { __awaiter } from "tslib";
import { BigNumber, ethers } from "ethers";
import { PERMIT2_MAPPING } from "../constants";
import { Permit2__factory } from "../contracts";
import { MissingConfiguration } from "../errors";
/**
 * Helper to track Permit2 nonces for addresses
 */
export class NonceManager {
    constructor(provider, chainId, permit2Address) {
        this.provider = provider;
        if (permit2Address) {
            this.permit2 = Permit2__factory.connect(permit2Address, provider);
        }
        else if (PERMIT2_MAPPING[chainId]) {
            this.permit2 = Permit2__factory.connect(PERMIT2_MAPPING[chainId], this.provider);
        }
        else {
            throw new MissingConfiguration("permit2", chainId.toString());
        }
        this.currentWord = new Map();
        this.currentBitmap = new Map();
    }
    /**
     * Finds the next unused nonce and returns it
     * Marks the nonce as used so it won't be returned again from this instance
     * NOTE: if any nonce usages are in-flight and created outside of this instance,
     * this function will not know about them and will return duplicates
     */
    useNonce(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const { word, bitmap } = yield this.getNextOpenWord(address);
            const bitPos = getFirstUnsetBit(bitmap);
            this.currentWord.set(address, word);
            this.currentBitmap.set(address, setBit(bitmap, bitPos));
            return buildNonce(word, bitPos);
        });
    }
    isUsed(address, nonce) {
        return __awaiter(this, void 0, void 0, function* () {
            const { word, bitPos } = splitNonce(nonce);
            const bitmap = yield this.permit2.nonceBitmap(address, word);
            return bitmap.div(BigNumber.from(2).pow(bitPos)).mod(2).eq(1);
        });
    }
    // Returns the first word that contains empty bits
    getNextOpenWord(address) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentWord = this.currentWord.get(address) || BigNumber.from(0);
            let bitmap = this.currentBitmap.get(address) ||
                (yield this.permit2.nonceBitmap(address, currentWord));
            while (bitmap.eq(ethers.constants.MaxUint256)) {
                currentWord = currentWord.add(1);
                bitmap = yield this.permit2.nonceBitmap(address, currentWord);
            }
            return {
                word: currentWord,
                bitmap: bitmap,
            };
        });
    }
}
// Splits a permit2 nonce into the word and bitPos
export function splitNonce(nonce) {
    const word = nonce.div(256);
    const bitPos = nonce.mod(256);
    return { word, bitPos };
}
// Builds a permit2 nonce from the given word and bitPos
export function buildNonce(word, bitPos) {
    // word << 8
    const shiftedWord = word.mul(256);
    return shiftedWord.add(bitPos);
}
// Returns the position of the first unset bit
// Returns -1 if all bits are set
export function getFirstUnsetBit(bitmap) {
    // Optimization if switch to library w/ bitwise operators:
    // return ~bitmap + (bitmap + 1)
    // instead we have to do a loop
    for (let i = 0; i < 256; i++) {
        if (bitmap.div(BigNumber.from(2).pow(i)).mod(2).eq(0)) {
            return i;
        }
    }
    return -1;
}
// Returns the given bignumber with the given bit set
// Does nothing if the given bit is already set
export function setBit(bitmap, bitPos) {
    // Optimization if switch to library w/ bitwise operators:
    // return bitmap & (1 << bitPos)
    const mask = BigNumber.from(2).pow(bitPos);
    if (bitmap.div(mask).mod(2).eq(1)) {
        return bitmap;
    }
    return bitmap.add(mask);
}
// Get parameters to cancel a nonce
export function getCancelSingleParams(nonceToCancel) {
    const { word, bitPos } = splitNonce(nonceToCancel);
    const mask = BigNumber.from(2).pow(bitPos);
    return { word, mask };
}
// Get parameters to cancel multiple nonces
export function getCancelMultipleParams(noncesToCancel) {
    const splitNonces = noncesToCancel.map(splitNonce);
    const splitNoncesByWord = {};
    splitNonces.forEach((splitNonce) => {
        const word = splitNonce.word.toString();
        if (!splitNoncesByWord[word]) {
            splitNoncesByWord[word] = [];
        }
        splitNoncesByWord[word].push(splitNonce);
    });
    return Object.entries(splitNoncesByWord).map(([word, splitNonce]) => {
        let mask = BigNumber.from(0);
        splitNonce.forEach((splitNonce) => {
            mask = mask.or(BigNumber.from(2).pow(splitNonce.bitPos));
        });
        return { word: BigNumber.from(word), mask };
    });
}
//# sourceMappingURL=NonceManager.js.map