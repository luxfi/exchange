import { BigNumber, ethers } from "ethers";
import invariant from "tiny-invariant";
import { OrderType, REACTOR_ADDRESS_MAPPING } from "../constants";
import { MissingConfiguration } from "../errors";
import { DutchOrder } from "../order";
import { OrderBuilder } from "./OrderBuilder";
/**
 * Helper builder for generating dutch limit orders
 */
export class DutchOrderBuilder extends OrderBuilder {
    static fromOrder(order) {
        // note chainId not used if passing in true reactor address
        const builder = new DutchOrderBuilder(order.chainId, order.info.reactor)
            .deadline(order.info.deadline)
            .decayEndTime(order.info.decayEndTime)
            .decayStartTime(order.info.decayStartTime)
            .swapper(order.info.swapper)
            .nonce(order.info.nonce)
            .input(order.info.input)
            .exclusiveFiller(order.info.exclusiveFiller, order.info.exclusivityOverrideBps)
            .validation({
            additionalValidationContract: order.info.additionalValidationContract,
            additionalValidationData: order.info.additionalValidationData,
        });
        for (const output of order.info.outputs) {
            builder.output(output);
        }
        return builder;
    }
    constructor(chainId, reactorAddress, permit2Address) {
        super();
        this.chainId = chainId;
        this.permit2Address = permit2Address;
        const mappedReactorAddress = REACTOR_ADDRESS_MAPPING[chainId]
            ? REACTOR_ADDRESS_MAPPING[chainId][OrderType.Dutch]
            : undefined;
        if (reactorAddress) {
            this.reactor(reactorAddress);
        }
        else if (mappedReactorAddress) {
            this.reactor(mappedReactorAddress);
        }
        else {
            throw new MissingConfiguration("reactor", chainId.toString());
        }
        this.info = {
            outputs: [],
            exclusiveFiller: ethers.constants.AddressZero,
            exclusivityOverrideBps: BigNumber.from(0),
        };
    }
    decayStartTime(decayStartTime) {
        this.info.decayStartTime = decayStartTime;
        return this;
    }
    decayEndTime(decayEndTime) {
        if (this.orderInfo.deadline === undefined) {
            super.deadline(decayEndTime);
        }
        this.info.decayEndTime = decayEndTime;
        return this;
    }
    input(input) {
        this.info.input = input;
        return this;
    }
    output(output) {
        if (!this.info.outputs) {
            this.info.outputs = [];
        }
        invariant(output.startAmount.gte(output.endAmount), `startAmount must be greater than endAmount: ${output.startAmount.toString()}`);
        this.info.outputs.push(output);
        return this;
    }
    deadline(deadline) {
        super.deadline(deadline);
        if (this.info.decayEndTime === undefined) {
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
    exclusiveFiller(exclusiveFiller, exclusivityOverrideBps) {
        this.info.exclusiveFiller = exclusiveFiller;
        this.info.exclusivityOverrideBps = exclusivityOverrideBps;
        return this;
    }
    build() {
        invariant(this.info.decayStartTime !== undefined, "decayStartTime not set");
        invariant(this.info.input !== undefined, "input not set");
        invariant(this.info.decayEndTime !== undefined, "decayEndTime not set");
        invariant(this.info.exclusiveFiller !== undefined, "exclusiveFiller not set");
        invariant(this.info.exclusivityOverrideBps !== undefined, "exclusivityOverrideBps not set");
        invariant(this.info.outputs !== undefined && this.info.outputs.length !== 0, "outputs not set");
        invariant(this.info.decayEndTime !== undefined ||
            this.getOrderInfo().deadline !== undefined, "Must set either deadline or decayEndTime");
        invariant(!this.orderInfo.deadline ||
            this.info.decayStartTime <= this.orderInfo.deadline, `decayStartTime must be before or same as deadline: ${this.info.decayStartTime}`);
        invariant(!this.orderInfo.deadline ||
            this.info.decayEndTime <= this.orderInfo.deadline, `decayEndTime must be before or same as deadline: ${this.info.decayEndTime}`);
        return new DutchOrder(Object.assign(this.getOrderInfo(), {
            decayStartTime: this.info.decayStartTime,
            decayEndTime: this.info.decayEndTime,
            exclusiveFiller: this.info.exclusiveFiller,
            exclusivityOverrideBps: this.info.exclusivityOverrideBps,
            input: this.info.input,
            outputs: this.info.outputs,
        }), this.chainId, this.permit2Address);
    }
}
//# sourceMappingURL=DutchOrderBuilder.js.map