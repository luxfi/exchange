"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
const ChevronDown = ({ className }) => _jsx("svg", { className: className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", strokeWidth: 2, children: _jsx("path", { d: "m6 9 6 6 6-6" }) });
const Plus = ({ className }) => _jsx("svg", { className: className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", strokeWidth: 2, children: _jsx("path", { d: "M12 5v14m-7-7h14" }) });
const X = ({ className }) => _jsx("svg", { className: className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", strokeWidth: 2, children: _jsx("path", { d: "M18 6 6 18M6 6l12 12" }) });
const Info = ({ className }) => _jsxs("svg", { className: className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", strokeWidth: 2, children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("path", { d: "M12 16v-4m0-4h.01" })] });
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { STRATEGY_TEMPLATES as DEFAULT_TEMPLATES } from "./types";
let nextLegId = 0;
function createLegId() {
    return `leg-${++nextLegId}`;
}
export function StrategyPanel({ underlying, expiration, templates = DEFAULT_TEMPLATES, onSubmit, onLegsChange, isConnected = false, onConnectWallet, className, }) {
    const [legs, setLegs] = React.useState([]);
    const [showTemplates, setShowTemplates] = React.useState(false);
    const updateAndNotify = (newLegs) => {
        setLegs(newLegs);
        onLegsChange?.(newLegs);
    };
    const addLeg = () => {
        updateAndNotify([
            ...legs,
            {
                id: createLegId(),
                side: "buy",
                optionType: "call",
                strike: null,
                quantity: 1,
                ratio: 1,
                expiration,
            },
        ]);
    };
    const removeLeg = (id) => {
        updateAndNotify(legs.filter((l) => l.id !== id));
    };
    const updateLeg = (id, field, value) => {
        updateAndNotify(legs.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
    };
    const applyTemplate = (template) => {
        updateAndNotify(template.legs.map((leg) => ({
            ...leg,
            id: createLegId(),
            strike: null,
            expiration,
        })));
        setShowTemplates(false);
    };
    const clearLegs = () => {
        updateAndNotify([]);
    };
    const handleSubmit = () => {
        if (!underlying || !expiration || legs.length === 0)
            return;
        if (!isConnected && onConnectWallet)
            return onConnectWallet();
        onSubmit?.({
            underlying,
            expiration,
            legs,
            type: "net_debit",
            timeInForce: "day",
        });
    };
    return (_jsxs(Card, { className: className, children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Strategy Builder" }), _jsxs("div", { className: "flex items-center gap-1", children: [legs.length > 0 && (_jsx(Button, { variant: "ghost", size: "sm", className: "h-7 text-xs", onClick: clearLegs, children: "Clear" })), _jsxs("div", { className: "relative", children: [_jsxs(Button, { variant: "outline", size: "sm", className: "h-7 text-xs gap-1", onClick: () => setShowTemplates(!showTemplates), children: ["Templates", _jsx(ChevronDown, { className: "h-3 w-3" })] }), showTemplates && (_jsx("div", { className: "absolute right-0 top-full z-50 mt-1 w-72 rounded-lg border bg-popover p-2 shadow-lg", children: _jsx("div", { className: "space-y-1", children: templates.map((t) => (_jsxs("button", { className: "flex w-full flex-col rounded-md px-3 py-2 text-left transition-colors hover:bg-accent", onClick: () => applyTemplate(t), children: [_jsx("span", { className: "text-sm font-medium", children: t.name }), _jsx("span", { className: "text-xs text-muted-foreground", children: t.description })] }, t.name))) }) }))] })] })] }) }), _jsxs(CardContent, { className: "space-y-3", children: [!underlying && (_jsx("div", { className: "rounded-lg bg-muted px-3 py-4 text-center text-sm text-muted-foreground", children: "Select an underlying token to build a strategy" })), underlying && legs.length === 0 && (_jsx("div", { className: "rounded-lg bg-muted px-3 py-4 text-center text-sm text-muted-foreground", children: _jsx("p", { children: "Add legs manually or pick a template above" }) })), legs.map((leg, idx) => (_jsxs("div", { className: "rounded-lg border bg-muted/50 p-3 space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-xs font-medium text-muted-foreground", children: ["Leg ", idx + 1] }), _jsx("button", { onClick: () => removeLeg(leg.id), className: "text-muted-foreground hover:text-foreground transition-colors", children: _jsx(X, { className: "h-3.5 w-3.5" }) })] }), _jsxs("div", { className: "grid grid-cols-5 gap-2", children: [_jsxs("select", { value: leg.side, onChange: (e) => updateLeg(leg.id, "side", e.target.value), className: "rounded-md border bg-background px-2 py-1.5 text-xs", children: [_jsx("option", { value: "buy", children: "Buy" }), _jsx("option", { value: "sell", children: "Sell" })] }), _jsxs("select", { value: leg.optionType, onChange: (e) => updateLeg(leg.id, "optionType", e.target.value), className: "rounded-md border bg-background px-2 py-1.5 text-xs", children: [_jsx("option", { value: "call", children: "Call" }), _jsx("option", { value: "put", children: "Put" })] }), _jsx(Input, { type: "number", placeholder: "Strike", value: leg.strike ?? "", onChange: (e) => updateLeg(leg.id, "strike", e.target.value ? Number(e.target.value) : null), className: "h-7 text-xs" }), _jsx(Input, { type: "number", placeholder: "Qty", value: leg.quantity, onChange: (e) => updateLeg(leg.id, "quantity", Number(e.target.value) || 1), className: "h-7 text-xs", min: "1" }), _jsx(Input, { type: "number", placeholder: "Ratio", value: leg.ratio, onChange: (e) => updateLeg(leg.id, "ratio", Number(e.target.value) || 1), className: "h-7 text-xs", min: "1" })] })] }, leg.id))), underlying && (_jsxs(Button, { variant: "outline", size: "sm", className: "w-full gap-1.5 text-xs", onClick: addLeg, children: [_jsx(Plus, { className: "h-3.5 w-3.5" }), "Add Leg"] })), legs.length > 0 && onSubmit && (_jsx(Button, { className: "w-full", size: "xl", disabled: !underlying || !expiration || legs.some((l) => l.strike === null), onClick: handleSubmit, children: !isConnected
                            ? "Connect Wallet"
                            : `Submit ${legs.length}-Leg Order` })), legs.length > 0 && (_jsxs("div", { className: "rounded-lg border bg-muted/30 p-3 space-y-2", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-xs font-medium text-muted-foreground", children: [_jsx(Info, { className: "h-3.5 w-3.5" }), "Strategy Summary"] }), _jsxs("div", { className: "space-y-1 text-xs", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Underlying" }), _jsx("span", { className: "font-medium", children: underlying })] }), expiration && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Expiration" }), _jsx("span", { className: "font-medium", children: expiration })] })), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Legs" }), _jsx("span", { className: "font-medium", children: legs.length })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Max Risk" }), _jsx("span", { className: "font-medium text-muted-foreground", children: "Requires pricing data" })] })] })] }))] })] }));
}
//# sourceMappingURL=strategy-panel.js.map