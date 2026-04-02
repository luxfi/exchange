"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "./ui/cn";
export function ExpirationBar({ expirations, selected, onSelect, className, }) {
    if (expirations.length === 0) {
        return (_jsx("div", { className: cn("flex items-center gap-2 text-sm text-muted-foreground", className), children: "Select an underlying to view expirations" }));
    }
    return (_jsxs("div", { className: cn("flex items-center gap-1 overflow-x-auto no-scrollbar", className), children: [_jsx("span", { className: "text-xs font-medium text-muted-foreground mr-2 shrink-0", children: "Exp" }), expirations.map((exp) => (_jsx("button", { onClick: () => onSelect(exp), className: cn("shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors", selected === exp
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"), children: exp }, exp)))] }));
}
//# sourceMappingURL=expiration-bar.js.map