import type { GetProps } from 'tamagui';
declare const BadgeFrame: import("tamagui").TamaguiComponent<import("@tamagui/core").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    size?: "md" | "sm" | "lg" | undefined;
    variant?: "success" | "warning" | "error" | "primary" | "outline" | "default" | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export type BadgeProps = GetProps<typeof BadgeFrame> & {
    children: React.ReactNode;
};
export declare function Badge({ children, variant, ...props }: BadgeProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Badge.d.ts.map