"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "./cn";
const sizeMap = {
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
};
export function TokenIcon({ symbol, logoUri, size = "md", className, }) {
    const [error, setError] = React.useState(false);
    const iconSize = sizeMap[size];
    const iconSrc = logoUri && !error ? logoUri : undefined;
    return (_jsx("div", { className: cn("relative flex-shrink-0 rounded-full overflow-hidden bg-muted flex items-center justify-center", className), style: { width: iconSize, height: iconSize }, children: iconSrc ? (_jsx("img", { src: iconSrc, alt: symbol, width: iconSize, height: iconSize, className: "object-cover", onError: () => setError(true) })) : (_jsx("span", { className: "font-bold text-muted-foreground", style: { fontSize: iconSize * 0.4 }, children: symbol.slice(0, 2) })) }));
}
//# sourceMappingURL=token-icon.js.map