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
        let noHexStringCasting: string;
    }
}
export function create(context: any): {
    TSTypeAssertion(node: any): void;
    TSAsExpression(node: any): void;
};
//# sourceMappingURL=no-hex-string-casting.d.ts.map