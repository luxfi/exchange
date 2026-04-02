export declare namespace env {
    let es6: boolean;
    let node: boolean;
}
export declare let plugins: string[];
declare let _extends: string[];
export { _extends as extends };
export declare namespace parserOptions {
    let ecmaVersion: number;
    let sourceType: string;
}
export declare let rules: {
    'check-file/no-index': (string | {
        ignoreMiddleExtensions: boolean;
    })[];
    'unused-imports/no-unused-imports': string;
    'react/display-name': string;
    'no-shadow': string;
    'no-ex-assign': string;
    'no-eval': string;
    'guard-for-in': string;
    'no-extra-boolean-cast': string;
    'object-shorthand': string[];
    'consistent-return': (string | {
        treatUndefinedAsUnspecified: boolean;
    })[];
    'max-lines': (string | number)[];
    'react/jsx-curly-brace-presence': (string | {
        props: string;
        children: string;
    })[];
    'max-params': (string | {
        max: number;
    })[];
    'react/no-danger': string;
    'react/no-danger-with-children': string;
    'react/no-unsafe': string;
    'no-unsanitized/method': string;
    'no-unsanitized/property': string;
    'security/detect-unsafe-regex': string;
    'security/detect-buffer-noassert': string;
    'security/detect-child-process': string;
    'security/detect-disable-mustache-escape': string;
    'security/detect-eval-with-expression': string;
    'security/detect-non-literal-regexp': string;
    'security/detect-pseudoRandomBytes': string;
    'security/detect-new-buffer': string;
    'no-restricted-globals': string[];
    'local-rules/no-unwrapped-t': (string | {
        blockedElements: string[];
    })[];
    '@typescript-eslint/no-unused-vars': (string | {
        args: string;
        argsIgnorePattern: string;
        caughtErrors: string;
        caughtErrorsIgnorePattern: string;
        destructuredArrayIgnorePattern: string;
        varsIgnorePattern: string;
        ignoreRestSiblings: boolean;
    })[];
};
export declare let overrides: ({
    files: string[];
    parser: string;
    plugins: string[];
    extends: string[];
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': string[];
        };
        'import/resolver': {
            typescript: {
                alwaysTryTypes: boolean;
            };
        };
    };
    rules: {
        'local-rules/prevent-this-method-destructure': string;
        'local-rules/enforce-query-options-result': (string | {
            importPath: string;
        })[];
        curly: string;
        'dot-notation': string;
        '@typescript-eslint/dot-notation': string;
        '@typescript-eslint/prefer-enum-initializers': string;
        '@typescript-eslint/no-explicit-any': string;
        '@typescript-eslint/ban-ts-comment': string;
        '@typescript-eslint/ban-ts-ignore': string;
        '@typescript-eslint/explicit-module-boundary-types': string;
        '@typescript-eslint/explicit-function-return-type': string;
        '@typescript-eslint/no-unnecessary-condition': (string | {
            allowConstantLoopConditions: boolean;
        })[];
        'no-console'?: undefined;
        'local-rules/no-hex-string-casting'?: undefined;
        'react/forbid-elements'?: undefined;
        'max-lines'?: undefined;
    };
    excludedFiles?: undefined;
    env?: undefined;
} | {
    files: string[];
    excludedFiles: string[];
    rules: {
        'no-console': string;
        'local-rules/no-hex-string-casting': string;
        'react/forbid-elements': (string | {
            forbid: {
                element: string;
                message: string;
            }[];
        })[];
        'local-rules/prevent-this-method-destructure'?: undefined;
        'local-rules/enforce-query-options-result'?: undefined;
        curly?: undefined;
        'dot-notation'?: undefined;
        '@typescript-eslint/dot-notation'?: undefined;
        '@typescript-eslint/prefer-enum-initializers'?: undefined;
        '@typescript-eslint/no-explicit-any'?: undefined;
        '@typescript-eslint/ban-ts-comment'?: undefined;
        '@typescript-eslint/ban-ts-ignore'?: undefined;
        '@typescript-eslint/explicit-module-boundary-types'?: undefined;
        '@typescript-eslint/explicit-function-return-type'?: undefined;
        '@typescript-eslint/no-unnecessary-condition'?: undefined;
        'max-lines'?: undefined;
    };
    parser?: undefined;
    plugins?: undefined;
    extends?: undefined;
    settings?: undefined;
    env?: undefined;
} | {
    files: string[];
    env: {
        jest: boolean;
        'jest/globals': boolean;
    };
    extends: string[];
    plugins: string[];
    parser?: undefined;
    settings?: undefined;
    rules?: undefined;
    excludedFiles?: undefined;
} | {
    files: string[];
    rules: {
        'max-lines': string;
        'local-rules/prevent-this-method-destructure'?: undefined;
        'local-rules/enforce-query-options-result'?: undefined;
        curly?: undefined;
        'dot-notation'?: undefined;
        '@typescript-eslint/dot-notation'?: undefined;
        '@typescript-eslint/prefer-enum-initializers'?: undefined;
        '@typescript-eslint/no-explicit-any'?: undefined;
        '@typescript-eslint/ban-ts-comment'?: undefined;
        '@typescript-eslint/ban-ts-ignore'?: undefined;
        '@typescript-eslint/explicit-module-boundary-types'?: undefined;
        '@typescript-eslint/explicit-function-return-type'?: undefined;
        '@typescript-eslint/no-unnecessary-condition'?: undefined;
        'no-console'?: undefined;
        'local-rules/no-hex-string-casting'?: undefined;
        'react/forbid-elements'?: undefined;
    };
    parser?: undefined;
    plugins?: undefined;
    extends?: undefined;
    settings?: undefined;
    excludedFiles?: undefined;
    env?: undefined;
})[];
//# sourceMappingURL=base.d.ts.map