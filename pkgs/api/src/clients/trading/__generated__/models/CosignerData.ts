/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CosignerData = {
    /**
     * The unix timestamp at which the order will be eligible to be filled by alternate fillers at a lower price. Noted that the fill amount will not be lower than the output `endAmount`.
     */
    decayStartTime?: number;
    /**
     * The unix timestamp at which the order will no longer be eligible to be filled by alternate fillers.
     */
    decayEndTime?: number;
    /**
     * The address of the filler who has priority to fill the order by the `decayStartTime`.
     */
    exclusiveFiller?: string;
    inputOverride?: string;
    outputOverrides?: Array<string>;
};

