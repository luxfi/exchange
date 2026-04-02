"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "./ui/cn";
export function OptionsOrderForm({ underlying, strike, optionSide, expiration, isConnected = false, onSubmit, onConnectWallet, className, }) {
    const [side, setSide] = React.useState("buy");
    const [orderType, setOrderType] = React.useState("limit");
    const [quantity, setQuantity] = React.useState("");
    const [limitPrice, setLimitPrice] = React.useState("");
    const hasSelection = underlying && strike !== null && optionSide && expiration;
    const getButtonText = () => {
        if (!isConnected)
            return "Connect Wallet";
        if (!hasSelection)
            return "Select an Option";
        if (!quantity || parseFloat(quantity) <= 0)
            return "Enter Quantity";
        if (orderType === "limit" && (!limitPrice || parseFloat(limitPrice) <= 0)) {
            return "Enter Limit Price";
        }
        return `${side === "buy" ? "Buy" : "Sell"} ${optionSide?.toUpperCase()} ${underlying} ${strike}`;
    };
    const isDisabled = () => {
        if (!isConnected)
            return false;
        if (!hasSelection)
            return true;
        if (!quantity || parseFloat(quantity) <= 0)
            return true;
        if (orderType === "limit" && (!limitPrice || parseFloat(limitPrice) <= 0)) {
            return true;
        }
        return false;
    };
    return (_jsxs(Card, { className: cn("w-full", className), children: [_jsx(CardHeader, { className: "pb-3", children: _jsx(CardTitle, { className: "text-sm font-medium", children: "Order" }) }), _jsxs(CardContent, { className: "space-y-4", children: [hasSelection ? (_jsxs("div", { className: "rounded-lg bg-muted px-3 py-2 text-sm", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Contract" }), _jsxs("span", { className: "font-medium", children: [underlying, " ", _jsxs("span", { className: optionSide === "call" ? "text-green-500" : "text-red-500", children: [strike, " ", optionSide?.toUpperCase()] })] })] }), _jsxs("div", { className: "flex items-center justify-between mt-1", children: [_jsx("span", { className: "text-muted-foreground", children: "Expiration" }), _jsx("span", { className: "font-medium", children: expiration })] })] })) : (_jsx("div", { className: "rounded-lg bg-muted px-3 py-4 text-center text-sm text-muted-foreground", children: "Click on a bid/ask in the chain to select an option" })), _jsxs("div", { className: "grid grid-cols-2 gap-1 rounded-lg bg-muted p-1", children: [_jsx("button", { className: cn("rounded-md py-1.5 text-sm font-medium transition-colors", side === "buy"
                                    ? "bg-green-500 text-white"
                                    : "text-muted-foreground hover:text-foreground"), onClick: () => setSide("buy"), children: "Buy" }), _jsx("button", { className: cn("rounded-md py-1.5 text-sm font-medium transition-colors", side === "sell"
                                    ? "bg-red-500 text-white"
                                    : "text-muted-foreground hover:text-foreground"), onClick: () => setSide("sell"), children: "Sell" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-1 rounded-lg bg-muted p-1", children: [_jsx("button", { className: cn("rounded-md py-1.5 text-xs font-medium transition-colors", orderType === "limit"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"), onClick: () => setOrderType("limit"), children: "Limit" }), _jsx("button", { className: cn("rounded-md py-1.5 text-xs font-medium transition-colors", orderType === "market"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"), onClick: () => setOrderType("market"), children: "Market" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Contracts" }), _jsx(Input, { type: "number", placeholder: "0", min: "0", step: "1", value: quantity, onChange: (e) => setQuantity(e.target.value) })] }), orderType === "limit" && (_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Limit Price" }), _jsx(Input, { type: "number", placeholder: "0.00", min: "0", step: "0.01", value: limitPrice, onChange: (e) => setLimitPrice(e.target.value) })] })), quantity && parseFloat(quantity) > 0 && (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("span", { className: "text-muted-foreground", children: ["Est. ", side === "buy" ? "Cost" : "Credit"] }), _jsx("span", { className: "font-medium font-mono", children: orderType === "limit" && limitPrice && parseFloat(limitPrice) > 0
                                    ? `${(parseFloat(quantity) * parseFloat(limitPrice)).toFixed(2)} ${underlying}`
                                    : "Market price" })] })), _jsx(Button, { className: "w-full", variant: side === "buy" ? "default" : "destructive", size: "xl", disabled: isDisabled(), onClick: () => {
                            if (!isConnected && onConnectWallet)
                                return onConnectWallet();
                            if (onSubmit && !isDisabled()) {
                                onSubmit({
                                    side,
                                    type: orderType,
                                    quantity: parseFloat(quantity),
                                    limitPrice: orderType === "limit" ? parseFloat(limitPrice) : undefined,
                                });
                            }
                        }, children: getButtonText() })] })] }));
}
//# sourceMappingURL=options-order-form.js.map