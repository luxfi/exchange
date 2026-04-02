export declare let root: boolean;
export declare let parser: string;
export declare namespace parserOptions {
    namespace ecmaFeatures {
        let jsx: boolean;
        let modules: boolean;
        let experimentalObjectRestSpread: boolean;
    }
}
declare let _extends: string[];
export { _extends as extends };
export declare let plugins: string[];
export declare let rules: {
    '@typescript-eslint/no-restricted-imports': any[];
    'dot-notation': string;
    '@typescript-eslint/dot-notation': string;
    'max-depth': (string | number)[];
    'max-nested-callbacks': (string | number)[];
    complexity: (string | number)[];
    'prettier/prettier': number;
    semi: number;
    quotes: number;
    'comma-dangle': number;
    'no-trailing-spaces': number;
    'react-native/no-inline-styles': string;
    '@typescript-eslint/no-unused-expressions': (number | {
        allowShortCircuit: boolean;
        allowTernary: boolean;
    })[];
    '@typescript-eslint/naming-convention': (number | {
        selector: string;
        format: string[];
    })[];
    'jest/no-export': string;
    'jest/valid-describe-callback': string;
    'jest/valid-title': (number | {
        ignoreTypeOfDescribeName: boolean;
    })[];
    'jest/expect-expect': (number | {
        assertFunctionNames: string[];
    })[];
    'jest/no-conditional-expect': string;
    'jest/no-disabled-tests': string;
    'react-hooks/exhaustive-deps': (string | {
        additionalHooks: string;
    })[];
    'no-restricted-syntax': (string | {
        selector: string;
        message: string;
    })[];
    'react/jsx-sort-props': (number | {
        callbacksLast: boolean;
        shorthandFirst: boolean;
        ignoreCase: boolean;
        noSortAlphabetically: boolean;
        reservedFirst: boolean;
    })[];
    'react-native/no-unused-styles': string;
    'react-native/sort-styles': string;
    'react/no-unstable-nested-components': string;
    'react/react-in-jsx-scope': string;
    'consistent-return': (string | {
        treatUndefinedAsUnspecified: boolean;
    })[];
    '@typescript-eslint/no-floating-promises': string;
    '@typescript-eslint/no-shadow': string;
    '@typescript-eslint/no-var-requires': string;
    '@typescript-eslint/no-require-imports': string;
    'max-params': (string | {
        max: number;
    })[];
};
export declare let overrides: ({
    files: string[];
    rules: {
        '@typescript-eslint/no-restricted-imports': (string | {
            paths: any;
        })[];
        '@typescript-eslint/explicit-function-return-type'?: undefined;
        '@typescript-eslint/prefer-enum-initializers'?: undefined;
        '@typescript-eslint/no-unsafe-return'?: undefined;
        '@typescript-eslint/no-non-null-assertion'?: undefined;
        '@typescript-eslint/no-empty-interface'?: undefined;
        '@jambit/typed-redux-saga/use-typed-effects'?: undefined;
        '@jambit/typed-redux-saga/delegate-effects'?: undefined;
        'no-console'?: undefined;
        'local-rules/no-transform-percentage-strings'?: undefined;
        'react/forbid-elements'?: undefined;
        'max-nested-callbacks'?: undefined;
    };
    excludedFiles?: undefined;
} | {
    files: string[];
    rules: {
        '@typescript-eslint/explicit-function-return-type': (string | {
            allowedNames: string[];
        })[];
        '@typescript-eslint/no-restricted-imports'?: undefined;
        '@typescript-eslint/prefer-enum-initializers'?: undefined;
        '@typescript-eslint/no-unsafe-return'?: undefined;
        '@typescript-eslint/no-non-null-assertion'?: undefined;
        '@typescript-eslint/no-empty-interface'?: undefined;
        '@jambit/typed-redux-saga/use-typed-effects'?: undefined;
        '@jambit/typed-redux-saga/delegate-effects'?: undefined;
        'no-console'?: undefined;
        'local-rules/no-transform-percentage-strings'?: undefined;
        'react/forbid-elements'?: undefined;
        'max-nested-callbacks'?: undefined;
    };
    excludedFiles?: undefined;
} | {
    files: string[];
    excludedFiles: string[];
    rules: {
        '@typescript-eslint/prefer-enum-initializers': string;
        '@typescript-eslint/no-unsafe-return': string;
        '@typescript-eslint/no-non-null-assertion': string;
        '@typescript-eslint/explicit-function-return-type': string;
        '@typescript-eslint/no-empty-interface': string;
        '@typescript-eslint/no-restricted-imports'?: undefined;
        '@jambit/typed-redux-saga/use-typed-effects'?: undefined;
        '@jambit/typed-redux-saga/delegate-effects'?: undefined;
        'no-console'?: undefined;
        'local-rules/no-transform-percentage-strings'?: undefined;
        'react/forbid-elements'?: undefined;
        'max-nested-callbacks'?: undefined;
    };
} | {
    files: string[];
    rules: {
        '@typescript-eslint/explicit-function-return-type': string;
        '@typescript-eslint/no-restricted-imports'?: undefined;
        '@typescript-eslint/prefer-enum-initializers'?: undefined;
        '@typescript-eslint/no-unsafe-return'?: undefined;
        '@typescript-eslint/no-non-null-assertion'?: undefined;
        '@typescript-eslint/no-empty-interface'?: undefined;
        '@jambit/typed-redux-saga/use-typed-effects'?: undefined;
        '@jambit/typed-redux-saga/delegate-effects'?: undefined;
        'no-console'?: undefined;
        'local-rules/no-transform-percentage-strings'?: undefined;
        'react/forbid-elements'?: undefined;
        'max-nested-callbacks'?: undefined;
    };
    excludedFiles?: undefined;
} | {
    files: string[];
    excludedFiles: string[];
    rules: {
        '@jambit/typed-redux-saga/use-typed-effects': string;
        '@jambit/typed-redux-saga/delegate-effects': string;
        'no-console': string;
        'local-rules/no-transform-percentage-strings': string;
        'react/forbid-elements': (string | {
            forbid: {
                element: string;
                message: string;
            }[];
        })[];
        '@typescript-eslint/no-restricted-imports'?: undefined;
        '@typescript-eslint/explicit-function-return-type'?: undefined;
        '@typescript-eslint/prefer-enum-initializers'?: undefined;
        '@typescript-eslint/no-unsafe-return'?: undefined;
        '@typescript-eslint/no-non-null-assertion'?: undefined;
        '@typescript-eslint/no-empty-interface'?: undefined;
        'max-nested-callbacks'?: undefined;
    };
} | {
    files: string[];
    rules: {
        'max-nested-callbacks': (string | number)[];
        '@typescript-eslint/no-restricted-imports'?: undefined;
        '@typescript-eslint/explicit-function-return-type'?: undefined;
        '@typescript-eslint/prefer-enum-initializers'?: undefined;
        '@typescript-eslint/no-unsafe-return'?: undefined;
        '@typescript-eslint/no-non-null-assertion'?: undefined;
        '@typescript-eslint/no-empty-interface'?: undefined;
        '@jambit/typed-redux-saga/use-typed-effects'?: undefined;
        '@jambit/typed-redux-saga/delegate-effects'?: undefined;
        'no-console'?: undefined;
        'local-rules/no-transform-percentage-strings'?: undefined;
        'react/forbid-elements'?: undefined;
    };
    excludedFiles?: undefined;
})[];
//# sourceMappingURL=native.d.ts.map