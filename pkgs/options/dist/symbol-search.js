"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
// Inline SVG icons — no lucide dependency
const SearchIcon = () => _jsxs("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", strokeWidth: 2, children: [_jsx("circle", { cx: "11", cy: "11", r: "8" }), _jsx("path", { d: "m21 21-4.3-4.3" })] });
const ChevronDownIcon = () => _jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", strokeWidth: 2, children: _jsx("path", { d: "m6 9 6 6 6-6" }) });
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { TokenIcon } from "./ui/token-icon";
import { cn } from "./ui/cn";
export function SymbolSearch({ selectedToken, onSelect, tokens, className, }) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const ref = React.useRef(null);
    const filtered = React.useMemo(() => {
        if (!query)
            return tokens;
        const q = query.toLowerCase();
        return tokens.filter((t) => t.symbol.toLowerCase().includes(q) ||
            t.name.toLowerCase().includes(q));
    }, [tokens, query]);
    // Close on outside click
    React.useEffect(() => {
        function handleClick(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);
    return (_jsxs("div", { ref: ref, className: cn("relative", className), children: [_jsxs(Button, { variant: "outline", className: "flex items-center gap-2 h-10 px-3", onClick: () => setOpen(!open), children: [selectedToken ? (_jsxs(_Fragment, { children: [_jsx(TokenIcon, { symbol: selectedToken.symbol, logoUri: selectedToken.logoUri, size: "sm" }), _jsx("span", { className: "font-semibold", children: selectedToken.symbol })] })) : (_jsx("span", { className: "text-muted-foreground", children: "Select token" })), _jsx("span", { className: "text-muted-foreground", children: _jsx(ChevronDownIcon, {}) })] }), open && (_jsxs("div", { className: "absolute top-full left-0 z-50 mt-1 w-72 rounded-lg border bg-popover p-2 shadow-lg", children: [_jsxs("div", { className: "relative mb-2", children: [_jsx("span", { className: "absolute left-2.5 top-2.5 text-muted-foreground", children: _jsx(SearchIcon, {}) }), _jsx(Input, { placeholder: "Search tokens...", value: query, onChange: (e) => setQuery(e.target.value), className: "pl-8 h-9", autoFocus: true })] }), _jsx("div", { className: "max-h-64 overflow-y-auto space-y-0.5", children: filtered.length === 0 ? (_jsx("div", { className: "py-6 text-center text-sm text-muted-foreground", children: "No tokens found" })) : (filtered.map((token) => (_jsxs("button", { className: cn("flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent", selectedToken?.symbol === token.symbol &&
                                selectedToken?.chainId === token.chainId &&
                                "bg-accent"), onClick: () => {
                                onSelect(token);
                                setOpen(false);
                                setQuery("");
                            }, children: [_jsx(TokenIcon, { symbol: token.symbol, logoUri: token.logoUri, size: "sm" }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "font-medium", children: token.symbol }), _jsx("span", { className: "text-xs text-muted-foreground", children: token.name })] })] }, `${token.chainId}-${token.symbol}-${token.address}`)))) })] }))] }));
}
//# sourceMappingURL=symbol-search.js.map