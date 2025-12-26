import { GetProps } from '@tamagui/core';
declare const TokenLogoFrame: import("tamagui").TamaguiComponent<import("@tamagui/core").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    size?: "md" | "sm" | "lg" | "xl" | "xs" | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export type TokenLogoProps = GetProps<typeof TokenLogoFrame> & {
    symbol: string;
    logoURI?: string;
};
export declare function TokenLogo({ symbol, logoURI, size, ...props }: TokenLogoProps): import("react/jsx-runtime").JSX.Element;
export declare namespace TokenLogo {
    var displayName: string;
}
export {};
//# sourceMappingURL=TokenLogo.d.ts.map