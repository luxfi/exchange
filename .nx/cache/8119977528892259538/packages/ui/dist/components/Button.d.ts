import { GetProps } from '@tamagui/core';
declare const ButtonFrame: import("tamagui").TamaguiComponent<import("@tamagui/core").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    size?: "md" | "sm" | "lg" | "xl" | undefined;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | undefined;
    fullWidth?: boolean | undefined;
    circular?: boolean | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export type ButtonProps = GetProps<typeof ButtonFrame> & {
    children?: React.ReactNode;
};
export declare function Button({ children, size, ...props }: ButtonProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Button {
    var displayName: string;
}
export {};
//# sourceMappingURL=Button.d.ts.map