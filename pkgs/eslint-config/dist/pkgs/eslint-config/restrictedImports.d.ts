declare namespace sharedRules {
    let paths: ({
        name: string;
        message: string;
        importNames?: undefined;
    } | {
        name: string;
        importNames: string[];
        message: string;
    })[];
    let patterns: {
        group: string[];
        message: string;
    }[];
}
declare namespace nativeRules {
    let paths_1: ({
        name: string;
        message: string;
        importNames?: undefined;
    } | {
        name: string;
        importNames: string[];
        message: string;
    })[];
    export { paths_1 as paths };
    import patterns_1 = sharedRules.patterns;
    export { patterns_1 as patterns };
}
declare namespace webPlatformRules {
    let paths_2: ({
        name: string;
        message: string;
        importNames?: undefined;
    } | {
        name: string;
        importNames: string[];
        message: string;
    })[];
    export { paths_2 as paths };
    let patterns_2: {
        group: string[];
        message: string;
    }[];
    export { patterns_2 as patterns };
}
export namespace reactNative {
    let patterns_3: {
        group: string[];
        allowTypeImports: boolean;
        message: string;
    }[];
    export { patterns_3 as patterns };
}
declare namespace interfaceRules {
    let paths_3: ({
        name: string;
        message: string;
        importNames?: undefined;
    } | {
        name: string;
        importNames: string[];
        message: string;
    } | {
        name: string;
        message: string;
        allowTypeImports: boolean;
    })[];
    export { paths_3 as paths };
    import patterns_4 = webPlatformRules.patterns;
    export { patterns_4 as patterns };
}
declare namespace extensionRules {
    let paths_4: ({
        name: string;
        message: string;
        importNames?: undefined;
    } | {
        name: string;
        importNames: string[];
        message: string;
    })[];
    export { paths_4 as paths };
    let patterns_5: {
        group: string[];
        message: string;
    }[];
    export { patterns_5 as patterns };
}
export { sharedRules as shared, nativeRules as native, webPlatformRules as webPlatform, interfaceRules as _interface, _interface as interface, extensionRules as extension };
//# sourceMappingURL=restrictedImports.d.ts.map