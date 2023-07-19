import arg from 'arg';
export class Parser {
    constructor(config) {
        Object.defineProperty(this, "_args", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "_config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._config = config;
    }
    get args() { return this._args; }
    get config() { return this._config; }
    parseArgumentsIntoOptions(rawArgs) {
        this._args = arg(this._config, {
            argv: rawArgs.slice(2),
        });
    }
}
