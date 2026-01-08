"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeExclusiveFillerData = exports.parseExclusiveFillerData = exports.parseValidation = exports.ValidationType = void 0;
const ethers_1 = require("ethers");
const constants_1 = require("../constants");
var ValidationType;
(function (ValidationType) {
    ValidationType[ValidationType["None"] = 0] = "None";
    ValidationType[ValidationType["ExclusiveFiller"] = 1] = "ExclusiveFiller";
})(ValidationType = exports.ValidationType || (exports.ValidationType = {}));
const NONE_VALIDATION = {
    type: ValidationType.None,
    data: null,
};
function parseValidation(info) {
    // TODO: extend to support multiple validation types
    // Add mapping of address to validation type, if no matches iterate through attempting to parse
    const data = parseExclusiveFillerData(info.additionalValidationData);
    if (data.type !== ValidationType.None) {
        return data;
    }
    return NONE_VALIDATION;
}
exports.parseValidation = parseValidation;
// returns decoded filler data, or null if invalid encoding
function parseExclusiveFillerData(encoded) {
    try {
        const [address, timestamp] = new ethers_1.ethers.utils.AbiCoder().decode(["address", "uint256"], encoded);
        return {
            type: ValidationType.ExclusiveFiller,
            data: {
                filler: address,
                lastExclusiveTimestamp: timestamp.toNumber(),
            },
        };
    }
    catch (_a) {
        return NONE_VALIDATION;
    }
}
exports.parseExclusiveFillerData = parseExclusiveFillerData;
// returns decoded filler data, or null if invalid encoding
function encodeExclusiveFillerData(fillerAddress, lastExclusiveTimestamp, chainId, additionalValidationContractAddress) {
    let additionalValidationContract = "";
    if (additionalValidationContractAddress) {
        additionalValidationContract = additionalValidationContractAddress;
    }
    else if (chainId) {
        additionalValidationContract = constants_1.EXCLUSIVE_FILLER_VALIDATION_MAPPING[chainId];
    }
    else {
        throw new Error("No validation contract provided");
    }
    const encoded = new ethers_1.ethers.utils.AbiCoder().encode(["address", "uint256"], [fillerAddress, lastExclusiveTimestamp]);
    return {
        additionalValidationContract,
        additionalValidationData: encoded,
    };
}
exports.encodeExclusiveFillerData = encodeExclusiveFillerData;
//# sourceMappingURL=validation.js.map