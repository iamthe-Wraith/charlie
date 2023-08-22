export class FatalError extends Error {
    constructor(message) {
        super(message);
        Object.defineProperty(this, "isFatal", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        this.name = 'FatalError';
    }
}
