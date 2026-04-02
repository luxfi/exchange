type OrderSide = "buy" | "sell";
type OrderType = "limit" | "market";
export interface OptionsOrderFormProps {
    underlying: string | null;
    strike: number | null;
    optionSide: "call" | "put" | null;
    expiration: string | null;
    isConnected?: boolean;
    onSubmit?: (order: {
        side: OrderSide;
        type: OrderType;
        quantity: number;
        limitPrice?: number;
    }) => void;
    onConnectWallet?: () => void;
    className?: string;
}
export declare function OptionsOrderForm({ underlying, strike, optionSide, expiration, isConnected, onSubmit, onConnectWallet, className, }: OptionsOrderFormProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=options-order-form.d.ts.map