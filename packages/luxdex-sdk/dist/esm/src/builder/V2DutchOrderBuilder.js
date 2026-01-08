import { BigNumber, ethers } from "ethers";
import invariant from "tiny-invariant";
import { OrderType } from "../constants";
import { CosignedV2DutchOrder, UnsignedV2DutchOrder, } from "../order";
import { getPermit2, getReactor } from "../utils";
import { OrderBuilder } from "./OrderBuilder";
/**
 * Helper builder for generating dutch limit orders
 */
export class V2DutchOrderBuilder extends OrderBuilder {
    static fromOrder(order) {
        const builder = new V2DutchOrderBuilder(order.chainId, order.info.reactor)
            .deadline(order.info.deadline)
            .swapper(order.info.swapper)
            .nonce(order.info.nonce)
            .input(order.info.input)
            .cosigner(order.info.cosigner)
            .validation({
            additionalValidationContract: order.info.additionalValidationContract,
            additionalValidationData: order.info.additionalValidationData,
        });
        for (const output of order.info.outputs) {
            builder.output(output);
        }
        if (order instanceof CosignedV2DutchOrder) {
            builder.cosignature(order.info.cosignature);
            builder.decayEndTime(order.info.cosignerData.decayEndTime);
            builder.decayStartTime(order.info.cosignerData.decayStartTime);
            builder.cosignerData(order.info.cosignerData);
        }
        return builder;
    }
    constructor(chainId, reactorAddress, _permit2Address) {
        super();
        this.chainId = chainId;
        this.reactor(getReactor(chainId, OrderType.Dutch_V2, reactorAddress));
        this.permit2Address = getPermit2(chainId, _permit2Address);
        this.info = {
            outputs: [],
            cosignerData: {
                decayStartTime: 0,
                decayEndTime: 0,
                exclusiveFiller: ethers.constants.AddressZero,
                exclusivityOverrideBps: BigNumber.from(0),
                inputOverride: BigNumber.from(0),
                outputOverrides: [],
            },
        };
    }
    decayStartTime(decayStartTime) {
        if (!this.info.cosignerData) {
            this.initializeCosignerData({ decayStartTime });
        }
        else {
            this.info.cosignerData.decayStartTime = decayStartTime;
        }
        return this;
    }
    decayEndTime(decayEndTime) {
        if (!this.info.cosignerData) {
            this.initializeCosignerData({ decayEndTime });
        }
        else {
            this.info.cosignerData.decayEndTime = decayEndTime;
        }
        if (!this.orderInfo.deadline) {
            super.deadline(decayEndTime);
        }
        return this;
    }
    input(input) {
        this.info.input = input;
        return this;
    }
    output(output) {
        var _a;
        invariant(output.startAmount.gte(output.endAmount), `startAmount must be greater than endAmount: ${output.startAmount.toString()}`);
        (_a = this.info.outputs) === null || _a === void 0 ? void 0 : _a.push(output);
        return this;
    }
    deadline(deadline) {
        super.deadline(deadline);
        if (!this.info.cosignerData) {
            this.initializeCosignerData({ decayEndTime: deadline });
        }
        else if (!this.info.cosignerData.decayEndTime) {
            this.decayEndTime(deadline);
        }
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
    exclusiveFiller(exclusiveFiller) {
        if (!this.info.cosignerData) {
            this.info.cosignerData = {
                decayStartTime: 0,
                decayEndTime: 0,
                exclusiveFiller: exclusiveFiller,
                exclusivityOverrideBps: BigNumber.from(0),
                inputOverride: BigNumber.from(0),
                outputOverrides: [],
            };
        }
        this.info.cosignerData.exclusiveFiller = exclusiveFiller;
        return this;
    }
    exclusivityOverrideBps(exclusivityOverrideBps) {
        if (!this.info.cosignerData) {
            this.info.cosignerData = {
                decayStartTime: 0,
                decayEndTime: 0,
                exclusiveFiller: ethers.constants.AddressZero,
                exclusivityOverrideBps: exclusivityOverrideBps,
                inputOverride: BigNumber.from(0),
                outputOverrides: [],
            };
        }
        this.info.cosignerData.exclusivityOverrideBps = exclusivityOverrideBps;
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
    cosigner(cosigner) {
        this.info.cosigner = cosigner;
        return this;
    }
    cosignature(cosignature) {
        this.info.cosignature = cosignature;
        return this;
    }
    cosignerData(cosignerData) {
        this.decayStartTime(cosignerData.decayStartTime);
        this.decayEndTime(cosignerData.decayEndTime);
        this.exclusiveFiller(cosignerData.exclusiveFiller);
        this.exclusivityOverrideBps(cosignerData.exclusivityOverrideBps);
        this.inputOverride(cosignerData.inputOverride);
        this.outputOverrides(cosignerData.outputOverrides);
        return this;
    }
    buildPartial() {
        var _a, _b;
        invariant(this.info.cosigner !== undefined, "cosigner not set");
        invariant(this.info.input !== undefined, "input not set");
        invariant(this.info.outputs && this.info.outputs.length > 0, "outputs not set");
        invariant(this.info.input !== undefined, "original input not set");
        invariant(!this.orderInfo.deadline ||
            (this.info.cosignerData &&
                this.info.cosignerData.decayStartTime <= this.orderInfo.deadline), `if present, decayStartTime must be before or same as deadline: ${(_a = this.info.cosignerData) === null || _a === void 0 ? void 0 : _a.decayStartTime}`);
        invariant(!this.orderInfo.deadline ||
            (this.info.cosignerData &&
                this.info.cosignerData.decayEndTime <= this.orderInfo.deadline), `if present, decayEndTime must be before or same as deadline: ${(_b = this.info.cosignerData) === null || _b === void 0 ? void 0 : _b.decayEndTime}`);
        return new UnsignedV2DutchOrder(Object.assign(this.getOrderInfo(), {
            input: this.info.input,
            outputs: this.info.outputs,
            cosigner: this.info.cosigner,
        }), this.chainId, this.permit2Address);
    }
    build() {
        invariant(this.info.cosigner !== undefined, "cosigner not set");
        invariant(this.info.cosignature !== undefined, "cosignature not set");
        invariant(this.info.input !== undefined, "input not set");
        invariant(this.info.outputs && this.info.outputs.length > 0, "outputs not set");
        invariant(this.info.cosignerData !== undefined, "cosignerData not set");
        invariant(this.info.cosignerData.decayStartTime !== undefined, "decayStartTime not set");
        invariant(this.info.cosignerData.decayEndTime !== undefined ||
            this.orderInfo.deadline !== undefined, "Neither decayEndTime or deadline not set");
        invariant(this.info.cosignerData.exclusiveFiller !== undefined, "exclusiveFiller not set");
        invariant(this.info.cosignerData.exclusivityOverrideBps !== undefined, "exclusivityOverrideBps not set");
        invariant(this.info.cosignerData.inputOverride.lte(this.info.input.startAmount), "inputOverride larger than original input");
        invariant(this.info.cosignerData.outputOverrides.length > 0, "outputOverrides not set");
        this.info.cosignerData.outputOverrides.forEach((override, idx) => {
            invariant(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            override.gte(this.info.outputs[idx].startAmount), "outputOverride must be larger than or equal to original output");
        });
        invariant(this.info.input !== undefined, "original input not set");
        invariant(!this.orderInfo.deadline ||
            this.info.cosignerData.decayStartTime <= this.orderInfo.deadline, `decayStartTime must be before or same as deadline: ${this.info.cosignerData.decayStartTime}`);
        invariant(!this.orderInfo.deadline ||
            this.info.cosignerData.decayEndTime <= this.orderInfo.deadline, `decayEndTime must be before or same as deadline: ${this.info.cosignerData.decayEndTime}`);
        return new CosignedV2DutchOrder(Object.assign(this.getOrderInfo(), {
            cosignerData: this.info.cosignerData,
            input: this.info.input,
            outputs: this.info.outputs,
            cosigner: this.info.cosigner,
            cosignature: this.info.cosignature,
        }), this.chainId, this.permit2Address);
    }
    initializeCosignerData(overrides) {
        this.info.cosignerData = Object.assign({ decayStartTime: 0, decayEndTime: 0, exclusiveFiller: ethers.constants.AddressZero, exclusivityOverrideBps: BigNumber.from(0), inputOverride: BigNumber.from(0), outputOverrides: [] }, overrides);
    }
}
//# sourceMappingURL=V2DutchOrderBuilder.js.map