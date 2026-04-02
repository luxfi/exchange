import type { OptionStrike } from "./types";
interface OptionsChainProps {
    strikes: OptionStrike[];
    spotPrice: number | null;
    onSelectOption: (strike: number, side: "call" | "put") => void;
    selectedStrike: number | null;
    selectedSide: "call" | "put" | null;
    className?: string;
}
export declare function OptionsChain({ strikes, spotPrice, onSelectOption, selectedStrike, selectedSide, className, }: OptionsChainProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=options-chain.d.ts.map