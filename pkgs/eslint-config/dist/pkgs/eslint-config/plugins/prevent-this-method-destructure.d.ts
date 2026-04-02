export namespace meta {
    let type: string;
    namespace docs {
        let description: string;
        let category: string;
        let recommended: boolean;
    }
    let fixable: undefined;
    let schema: never[];
    namespace messages {
        let preventDestructure: string;
    }
}
export function create(context: any): {
    "VariableDeclarator[id.type='ObjectPattern']"(node: any): void;
};
//# sourceMappingURL=prevent-this-method-destructure.d.ts.map