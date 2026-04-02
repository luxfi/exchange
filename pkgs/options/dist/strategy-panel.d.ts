import type { StrategyLeg, StrategyTemplate, StrategyOrder } from "./types";
export interface StrategyPanelProps {
    underlying: string | null;
    expiration: string | null;
    templates?: StrategyTemplate[];
    onSubmit?: (order: StrategyOrder) => void;
    onLegsChange?: (legs: StrategyLeg[]) => void;
    isConnected?: boolean;
    onConnectWallet?: () => void;
    className?: string;
}
export declare function StrategyPanel({ underlying, expiration, templates, onSubmit, onLegsChange, isConnected, onConnectWallet, className, }: StrategyPanelProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=strategy-panel.d.ts.map