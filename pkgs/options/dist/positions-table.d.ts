import type { OptionPosition } from "./types";
export interface PositionsTableProps {
    positions: OptionPosition[];
    isConnected?: boolean;
    onClose?: (positionId: string) => void;
    onConnectWallet?: () => void;
    className?: string;
}
export declare function PositionsTable({ positions, isConnected, onClose, onConnectWallet, className, }: PositionsTableProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=positions-table.d.ts.map