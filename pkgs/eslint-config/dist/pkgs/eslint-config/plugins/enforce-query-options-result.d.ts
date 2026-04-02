export namespace meta {
    let type: string;
    namespace docs {
        let description: string;
        let category: string;
        let recommended: boolean;
    }
    let fixable: string;
    let schema: {
        type: string;
        properties: {
            importPath: {
                type: string;
                default: string;
            };
        };
        additionalProperties: boolean;
    }[];
    namespace messages {
        let useQueryOptionsResult: string;
    }
}
export function create(context: any): {
    ImportDeclaration(node: any): void;
    FunctionDeclaration(node: any): void;
    FunctionExpression(node: any): void;
    ArrowFunctionExpression(node: any): void;
    ExportNamedDeclaration(node: any): void;
};
//# sourceMappingURL=enforce-query-options-result.d.ts.map