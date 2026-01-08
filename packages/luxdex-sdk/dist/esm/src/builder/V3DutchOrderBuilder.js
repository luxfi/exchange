import { BigNumber, ethers } from "ethers";
import invariant from "tiny-invariant";
import { OrderType } from "../constants";
import { CosignedV3DutchOrder, UnsignedV3DutchOrder, } from "../order/V3DutchOrder";
import { getPermit2, getReactor } from "../utils";
import { OrderBuilder } from "./OrderBuilder";
export class V3DutchOrderBuilder extends OrderBuilder {
    static fromOrder(order) {
        const builder = new V3DutchOrderBuilder(order.chainId, order.info.reactor);
        builder
            .cosigner(order.info.cosigner)
            .startingBaseFee(order.info.startingBaseFee)
            .input(order.info.input)
            .deadline(order.info.deadline)
            .nonce(order.info.nonce)
            .swapper(order.info.swapper)
            .validation({
            additionalValidationContract: order.info.additionalValidationContract,
            additionalValidationData: order.info.additionalValidationData,
        });
        order.info.outputs.forEach((output) => {
            builder.output(output);
        });
        if (order instanceof CosignedV3DutchOrder) {
            builder.cosignature(order.info.cosignature);
            builder.decayStartBlock(order.info.cosignerData.decayStartBlock);
            builder.exclusiveFiller(order.info.cosignerData.exclusiveFiller);
            builder.inputOverride(order.info.cosignerData.inputOverride);
            builder.exclusivityOverrideBps(order.info.cosignerData.exclusivityOverrideBps);
            builder.outputOverrides(order.info.cosignerData.outputOverrides);
        }
        return builder;
    }
    build() {
        invariant(this.info.cosignature !== undefined, "cosignature not set");
        this.checkUnsignedInvariants(this.info);
        this.checkCosignedInvariants(this.info);
        return new CosignedV3DutchOrder(Object.assign(this.getOrderInfo(), {
            cosignerData: this.info.cosignerData,
            startingBaseFee: this.info.startingBaseFee,
            input: this.info.input,
            outputs: this.info.outputs,
            cosigner: this.info.cosigner,
            cosignature: this.info.cosignature,
        }), this.chainId, this.permit2Address);
    }
    constructor(chainId, reactorAddress, _permit2Address) {
        super();
        this.chainId = chainId;
        this.reactor(getReactor(chainId, OrderType.Dutch_V3, reactorAddress));
        this.permit2Address = getPermit2(chainId, _permit2Address);
        this.info = {
            outputs: [],
        };
        this.initializeCosignerData({});
    }
    cosigner(cosigner) {
        this.info.cosigner = cosigner;
        return this;
    }
    cosignature(cosignature) {
        this.info.cosignature = cosignature;
        return this;
    }
    decayStartBlock(decayStartBlock) {
        if (!this.info.cosignerData) {
            this.initializeCosignerData({ decayStartBlock });
        }
        else {
            this.info.cosignerData.decayStartBlock = decayStartBlock;
        }
        return this;
    }
    initializeCosignerData(data) {
        this.info.cosignerData = Object.assign({ decayStartBlock: 0, exclusiveFiller: ethers.constants.AddressZero, exclusivityOverrideBps: BigNumber.from(0), inputOverride: BigNumber.from(0), outputOverrides: [] }, data);
    }
    isRelativeBlocksIncreasing(relativeBlocks) {
        let prevBlock = 0;
        for (const block of relativeBlocks) {
            if (block <= prevBlock) {
                return false;
            }
            prevBlock = block;
        }
        return true;
    }
    checkUnsignedInvariants(info) {
        invariant(info.cosigner !== undefined, "cosigner not set");
        invariant(info.startingBaseFee !== undefined, "startingBaseFee not set");
        invariant(info.input !== undefined, "input not set");
        invariant(info.outputs && info.outputs.length > 0, "outputs not set");
        // Check if input curve is valid
        invariant(info.input.curve.relativeAmounts.length ===
            info.input.curve.relativeBlocks.length, "relativeBlocks and relativeAmounts length mismatch");
        invariant(this.isRelativeBlocksIncreasing(info.input.curve.relativeBlocks), "relativeBlocks not strictly increasing");
        // For each output's curve, we need to make sure relativeBlocks is strictly increasing
        info.outputs.forEach((output) => {
            invariant(output.curve.relativeBlocks.length ===
                output.curve.relativeAmounts.length, "relativeBlocks and relativeAmounts length mismatch");
            // For each output's curve, we need to make sure relativeBlocks is strictly increasing
            invariant(this.isRelativeBlocksIncreasing(output.curve.relativeBlocks), "relativeBlocks not strictly increasing");
        });
        // In V3, we don't have a decayEndTime field and use OrderInfo.deadline field for Permit2
        invariant(this.orderInfo.deadline !== undefined, "deadline not set");
        invariant(this.orderInfo.swapper !== undefined, "swapper not set");
    }
    checkCosignedInvariants(info) {
        // In V3, we are not enforcing that the startAmount is greater than the endAmount
        invariant(info.cosignerData !== undefined, "cosignerData not set");
        invariant(info.cosignerData.decayStartBlock !== undefined, "decayStartBlock not set");
        invariant(info.cosignerData.exclusiveFiller !== undefined, "exclusiveFiller not set");
        invariant(info.cosignerData.exclusivityOverrideBps !== undefined, "exclusivityOverrideBps not set");
        invariant(info.cosignerData.outputOverrides.length > 0, "outputOverrides not set");
        invariant(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        info.cosignerData.inputOverride.lte(this.info.input.startAmount), "inputOverride larger than original input");
        info.cosignerData.outputOverrides.forEach((override, idx) => {
            if (override.toString() != "0") {
                invariant(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                override.gte(this.info.outputs[idx].startAmount), "outputOverride smaller than original output");
            }
        });
        // We are not checking if the decayStartBlock is before the deadline because it is not enforced in the smart contract
    }
    startingBaseFee(startingBaseFee) {
        this.info.startingBaseFee = startingBaseFee;
        return this;
    }
    input(input) {
        this.info.input = input;
        return this;
    }
    output(output) {
        var _a;
        (_a = this.info.outputs) === null || _a === void 0 ? void 0 : _a.push(output);
        return this;
    }
    inputOverride(inputOverride) {
        if (!this.info.cosignerData) {
            this.initializeCosignerData({ inputOverride });
        }
        else {
            this.info.cosignerData.inputOverride = inputOverride;
        }
        return this;
    }
    outputOverrides(outputOverrides) {
        if (!this.info.cosignerData) {
            this.initializeCosignerData({ outputOverrides });
        }
        else {
            this.info.cosignerData.outputOverrides = outputOverrides;
        }
        return this;
    }
    deadline(deadline) {
        super.deadline(deadline);
        return this;
    }
    swapper(swapper) {
        super.swapper(swapper);
        return this;
    }
    nonce(nonce) {
        super.nonce(nonce);
        return this;
    }
    validation(info) {
        super.validation(info);
        return this;
    }
    cosignerData(cosignerData) {
        this.decayStartBlock(cosignerData.decayStartBlock);
        this.exclusiveFiller(cosignerData.exclusiveFiller);
        this.exclusivityOverrideBps(cosignerData.exclusivityOverrideBps);
        this.inputOverride(cosignerData.inputOverride);
        this.outputOverrides(cosignerData.outputOverrides);
        return this;
    }
    exclusiveFiller(exclusiveFiller) {
        if (!this.info.cosignerData) {
            this.initializeCosignerData({ exclusiveFiller });
        }
        else {
            this.info.cosignerData.exclusiveFiller = exclusiveFiller;
        }
        return this;
    }
    exclusivityOverrideBps(exclusivityOverrideBps) {
        if (!this.info.cosignerData) {
            this.initializeCosignerData({ exclusivityOverrideBps });
        }
        else {
            this.info.cosignerData.exclusivityOverrideBps = exclusivityOverrideBps;
        }
        return this;
    }
    // ensures that we only change non fee outputs
    nonFeeRecipient(newRecipient, feeRecipient) {
        invariant(newRecipient !== feeRecipient, `newRecipient must be different from feeRecipient: ${newRecipient}`);
        if (!this.info.outputs) {
            return this;
        }
        this.info.outputs = this.info.outputs.map((output) => {
            // if fee output then pass through
            if (feeRecipient &&
                output.recipient.toLowerCase() === feeRecipient.toLowerCase()) {
                return output;
            }
            return Object.assign(Object.assign({}, output), { recipient: newRecipient });
        });
        return this;
    }
    buildPartial() {
        //build an unsigned order
        this.checkUnsignedInvariants(this.info);
        return new UnsignedV3DutchOrder(Object.assign(this.getOrderInfo(), {
            input: this.info.input,
            outputs: this.info.outputs,
            cosigner: this.info.cosigner,
            startingBaseFee: this.info.startingBaseFee,
        }), this.chainId, this.permit2Address);
    }
    // A helper function for users of the class to easily find the value to pass to maxAmount in an input
    static getMaxAmountOut(startAmount, relativeAmounts) {
        if (relativeAmounts.length == 0) {
            return startAmount;
        }
        // Find the minimum of the relative amounts
        const minRelativeAmount = relativeAmounts.reduce((min, amount) => (amount < min ? amount : min), BigInt(0));
        // Maximum is the start - the min of the relative amounts
        const maxOut = startAmount.sub(minRelativeAmount.toString());
        return maxOut;
    }
    // A helper function for users of the class find the lowest possible output amount
    static getMinAmountOut(startAmount, relativeAmounts) {
        if (relativeAmounts.length == 0) {
            return startAmount;
        }
        // Find the maximum of the relative amounts
        const maxRelativeAmount = relativeAmounts.reduce((max, amount) => (amount > max ? amount : max), BigInt(0));
        // Minimum is the start - the max of the relative amounts
        const minOut = startAmount.sub(maxRelativeAmount.toString());
        return minOut;
    }
}
//# sourceMappingURL=V3DutchOrderBuilder.js.map