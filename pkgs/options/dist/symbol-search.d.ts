import type { Token } from "./types";
interface SymbolSearchProps {
    selectedToken: Token | null;
    onSelect: (token: Token) => void;
    tokens: Token[];
    className?: string;
}
export declare function SymbolSearch({ selectedToken, onSelect, tokens, className, }: SymbolSearchProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=symbol-search.d.ts.map