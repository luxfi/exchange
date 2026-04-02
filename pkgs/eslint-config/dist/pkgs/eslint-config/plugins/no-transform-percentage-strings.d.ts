export namespace meta {
    let type: string;
    namespace docs {
        let description: string;
        let category: string;
        let recommended: boolean;
    }
    let fixable: null;
    let schema: never[];
    namespace messages {
        let noPercentageTransform: string;
    }
}
export function create(context: any): {
    /**
     * Catch pattern 1: style={{ transform: [...] }}
     * Catch pattern 2: StyleSheet.create({ foo: { transform: [...] } })
     * Note: Skip if inside JSX to avoid duplicate reporting (handled by JSXAttribute)
     */
    Property(node: any): void;
    /**
     * Catch pattern 3: JSX transform prop
     * <Flex transform={[{ translateX: '40%' }]} />
     */
    JSXAttribute(node: any): void;
};
//# sourceMappingURL=no-transform-percentage-strings.d.ts.map