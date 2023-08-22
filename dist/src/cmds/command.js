export class Command {
    constructor(parser) {
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "parser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.parser = parser;
    }
    get args() { return this.parser.args; }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exec(args, config) {
        this.config = config;
        this.parser.parseArgumentsIntoOptions(args);
        return this.execCommand();
    }
}
