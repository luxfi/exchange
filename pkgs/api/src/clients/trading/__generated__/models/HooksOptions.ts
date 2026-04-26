/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The hook options to use for V4 pool quotes. `V4_HOOKS_INCLUSIVE` will get quotes for V4 pools with or without hooks. `V4_HOOKS_ONLY` will only get quotes for V4 pools with hooks. `V4_NO_HOOKS` will only get quotes for V4 pools without hooks. Defaults to `V4_HOOKS_INCLUSIVE` if `V4` is included in `protocols` and `hookOptions` is not set. This field is ignored if `V4` is not passed in `protocols`.
 */
export enum HooksOptions {
    V4_HOOKS_INCLUSIVE = 'V4_HOOKS_INCLUSIVE',
    V4_HOOKS_ONLY = 'V4_HOOKS_ONLY',
    V4_NO_HOOKS = 'V4_NO_HOOKS',
}
