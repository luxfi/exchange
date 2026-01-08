export class MissingConfiguration extends Error {
    constructor(key, value) {
        super(`Missing configuration for ${key}: ${value}`);
        Object.setPrototypeOf(this, MissingConfiguration.prototype);
    }
}
//# sourceMappingURL=errors.js.map