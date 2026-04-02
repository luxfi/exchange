"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "./ui/cn";
export function OptionsChain({ strikes, spotPrice, onSelectOption, selectedStrike, selectedSide, className, }) {
    if (strikes.length === 0) {
        return (_jsx("div", { className: cn("flex items-center justify-center py-16 text-sm text-muted-foreground", className), children: "No options data available. Select an underlying and expiration to view the chain." }));
    }
    return (_jsx("div", { className: cn("overflow-x-auto", className), children: _jsxs("table", { className: "w-full text-sm", children: [_jsxs("thead", { children: [_jsxs("tr", { className: "border-b text-muted-foreground", children: [_jsx("th", { className: "pb-2 pr-2 text-right font-medium text-green-500", colSpan: 5, children: "CALLS" }), _jsx("th", { className: "pb-2 px-3 text-center font-medium", children: "Strike" }), _jsx("th", { className: "pb-2 pl-2 text-left font-medium text-red-500", colSpan: 5, children: "PUTS" })] }), _jsxs("tr", { className: "border-b text-xs text-muted-foreground", children: [_jsx("th", { className: "pb-2 pr-2 text-right font-medium", children: "OI" }), _jsx("th", { className: "pb-2 pr-2 text-right font-medium", children: "Vol" }), _jsx("th", { className: "pb-2 pr-2 text-right font-medium", children: "IV" }), _jsx("th", { className: "pb-2 pr-2 text-right font-medium", children: "Bid" }), _jsx("th", { className: "pb-2 pr-2 text-right font-medium", children: "Ask" }), _jsx("th", { className: "pb-2 px-3 text-center font-medium", children: "Price" }), _jsx("th", { className: "pb-2 pl-2 text-left font-medium", children: "Bid" }), _jsx("th", { className: "pb-2 pl-2 text-left font-medium", children: "Ask" }), _jsx("th", { className: "pb-2 pl-2 text-left font-medium", children: "IV" }), _jsx("th", { className: "pb-2 pl-2 text-left font-medium", children: "Vol" }), _jsx("th", { className: "pb-2 pl-2 text-left font-medium", children: "OI" })] })] }), _jsx("tbody", { className: "font-mono text-xs", children: strikes.map((row) => {
                        const isAtm = spotPrice !== null &&
                            Math.abs(row.strike - spotPrice) ===
                                Math.min(...strikes.map((s) => spotPrice !== null ? Math.abs(s.strike - spotPrice) : Infinity));
                        const isItmCall = spotPrice !== null && row.strike < spotPrice;
                        const isItmPut = spotPrice !== null && row.strike > spotPrice;
                        const isCallSelected = selectedStrike === row.strike && selectedSide === "call";
                        const isPutSelected = selectedStrike === row.strike && selectedSide === "put";
                        return (_jsxs("tr", { className: cn("border-b border-border/50 transition-colors", isAtm && "bg-accent/30"), children: [_jsx("td", { className: cn("py-2 pr-2 text-right cursor-pointer hover:bg-green-500/10 transition-colors", isItmCall && "bg-green-500/5", isCallSelected && "bg-green-500/20"), onClick: () => onSelectOption(row.strike, "call"), children: formatInt(row.call.openInterest) }), _jsx("td", { className: cn("py-2 pr-2 text-right cursor-pointer hover:bg-green-500/10 transition-colors", isItmCall && "bg-green-500/5", isCallSelected && "bg-green-500/20"), onClick: () => onSelectOption(row.strike, "call"), children: formatInt(row.call.volume) }), _jsx("td", { className: cn("py-2 pr-2 text-right cursor-pointer hover:bg-green-500/10 transition-colors", isItmCall && "bg-green-500/5", isCallSelected && "bg-green-500/20"), onClick: () => onSelectOption(row.strike, "call"), children: row.call.iv !== null ? `${(row.call.iv * 100).toFixed(0)}%` : "-" }), _jsx("td", { className: cn("py-2 pr-2 text-right cursor-pointer hover:bg-green-500/10 transition-colors text-green-500", isItmCall && "bg-green-500/5", isCallSelected && "bg-green-500/20"), onClick: () => onSelectOption(row.strike, "call"), children: row.call.bid !== null ? formatPrice(row.call.bid) : "-" }), _jsx("td", { className: cn("py-2 pr-2 text-right cursor-pointer hover:bg-green-500/10 transition-colors text-green-500", isItmCall && "bg-green-500/5", isCallSelected && "bg-green-500/20"), onClick: () => onSelectOption(row.strike, "call"), children: row.call.ask !== null ? formatPrice(row.call.ask) : "-" }), _jsx("td", { className: cn("py-2 px-3 text-center font-semibold", isAtm && "text-primary"), children: formatPrice(row.strike) }), _jsx("td", { className: cn("py-2 pl-2 text-left cursor-pointer hover:bg-red-500/10 transition-colors text-red-500", isItmPut && "bg-red-500/5", isPutSelected && "bg-red-500/20"), onClick: () => onSelectOption(row.strike, "put"), children: row.put.bid !== null ? formatPrice(row.put.bid) : "-" }), _jsx("td", { className: cn("py-2 pl-2 text-left cursor-pointer hover:bg-red-500/10 transition-colors text-red-500", isItmPut && "bg-red-500/5", isPutSelected && "bg-red-500/20"), onClick: () => onSelectOption(row.strike, "put"), children: row.put.ask !== null ? formatPrice(row.put.ask) : "-" }), _jsx("td", { className: cn("py-2 pl-2 text-left cursor-pointer hover:bg-red-500/10 transition-colors", isItmPut && "bg-red-500/5", isPutSelected && "bg-red-500/20"), onClick: () => onSelectOption(row.strike, "put"), children: row.put.iv !== null ? `${(row.put.iv * 100).toFixed(0)}%` : "-" }), _jsx("td", { className: cn("py-2 pl-2 text-left cursor-pointer hover:bg-red-500/10 transition-colors", isItmPut && "bg-red-500/5", isPutSelected && "bg-red-500/20"), onClick: () => onSelectOption(row.strike, "put"), children: formatInt(row.put.volume) }), _jsx("td", { className: cn("py-2 pl-2 text-left cursor-pointer hover:bg-red-500/10 transition-colors", isItmPut && "bg-red-500/5", isPutSelected && "bg-red-500/20"), onClick: () => onSelectOption(row.strike, "put"), children: formatInt(row.put.openInterest) })] }, row.strike));
                    }) })] }) }));
}
function formatPrice(value) {
    if (value >= 1)
        return value.toFixed(2);
    if (value >= 0.01)
        return value.toFixed(4);
    return value.toFixed(6);
}
function formatInt(value) {
    if (value === 0)
        return "-";
    if (value >= 1_000_000)
        return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000)
        return `${(value / 1_000).toFixed(1)}K`;
    return value.toString();
}
//# sourceMappingURL=options-chain.js.map