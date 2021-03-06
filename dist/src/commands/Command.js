import { FatalError } from '../lib/error';
import { Logger } from '../lib/logger';
import { Parser } from '../lib/parser';
export class Command {
    constructor(props) {
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "parser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "docs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const { pattern = '', docs = null } = props;
        this.name = pattern.split(' ')[0].replace('<', '').replace('>', '');
        this.parser = new Parser(pattern);
        this.docs = docs;
    }
    /**
     * this method will be overwritten by any command that needs
     * something to be done before the main piece of execution
     * can run
     *
     * >>>>> IMPORTANT! <<<<<
     * when overwiting this method, it MUST receive
     * the context as its only argument, it MUST return a Promise,
     * and it MUST resolve with the context
     */
    before(ctx) {
        return new Promise(resolve => { resolve(ctx); });
    }
    /**
     * this method will be overwritten by any command that needs
     * something to be done after the main piece of execution
     * has run
     *
     * >>>>> IMPORTANT! <<<<<
     * when overwriting this method, it MUST receive
     * the context as its only argument, it MUST return a Promise,
     * and it MUST resolve with the context
     */
    after(ctx) {
        return new Promise(resolve => { resolve(ctx); });
    }
    /**
     * this method will be overwritten by all commands and is
     * the main piece of execution for the command
     *
     * >>>>> IMPORTANT! <<<<<
     * when overwiting this method, it MUST receive
     * the context as its only argument, it MUST return a Promise
     * and it MUST resolve with the context
     */
    main(ctx) {
        return new Promise((resolve) => {
            Logger.warning('Command:main has not been overwritten');
            resolve(ctx);
        });
    }
    /**
     * the primary method to call to execute the command
     */
    execute(ctx) {
        try {
            const parsed = this.parser.parse(ctx);
            return this.before(parsed)
                .then(this.main)
                .then(this.after);
        }
        catch (err) {
            Logger.error(err.message);
            process.exit(1);
        }
    }
    /**
     * registers a new argument
     *
     * @example: Command.argument('foo|f', { type: 'string' });
     */
    argument(name, opts) {
        try {
            return this.parser.argument(name, opts);
        }
        catch (err) {
            Logger.error(`\nCommand:argument error\n\n${err.message}\n`);
            if (err instanceof FatalError)
                process.exit(1);
        }
    }
    /**
     * registers a new parameter
     *
     * @param {string} name - the name and type of the parameter - (available types: string, int, float, boolean)
     * @param {Object|undefined} opts - optional options
     *
     * @example: Command.parameter('<foo:string>', { ... });
     */
    parameter(name, opts) {
        try {
            return this.parser.parameter(name, opts);
        }
        catch (err) {
            Logger.error(`\nCommand:parameter error\n\n${err.message}\n`);
            if (err instanceof FatalError)
                process.exit(1);
        }
    }
    /**
     * registers a new flag
     *
     * @example: Command.flag('foo|f', { ... });
     */
    flag(name, opts) {
        try {
            return this.parser.flag(name, opts);
        }
        catch (err) {
            Logger.error(`\nCommand:flag error\n\n${err.message}\n`);
            if (err instanceof FatalError)
                process.exit(1);
        }
    }
    help() {
        if (this.docs === null) {
            Logger.warning('[-] no documentation has been written for this command');
        }
        else {
            Logger.log('\n*******************************************\n');
            Logger.log(`${this.name}`);
            Logger.log(`${this.docs}\n`);
            if (Object.keys(this.parser.parameters).length > 0) {
                Logger.log('parameters (listed in the order they must be entered) :');
                for (const i in this.parser.parameters) {
                    const isRequired = this.parser.pattern.filter(pattern => pattern.name === i)[0].required;
                    Logger.log(`\t${i} <${this.parser.parameters[i].type}> ${isRequired ? '' : '[optional]'}`);
                    Logger.log(`\t${'description' in this.parser.parameters[i] ? this.parser.parameters[i].description : ''}\n`);
                }
            }
            if (Object.keys(this.parser.arguments).length > 0) {
                Logger.log('arguments:');
                for (const i in this.parser.arguments) {
                    Logger.log(`\t--${i}${'shortHand' in this.parser.arguments[i] && this.parser.arguments[i].shortHand ? `|-${this.parser.arguments[i].shortHand}` : ''} <${this.parser.arguments[i].type}>`);
                    Logger.log(`\t${'description' in this.parser.arguments[i] ? this.parser.arguments[i].description : ''}\n`);
                }
            }
            if (Object.keys(this.parser.flags).length > 0) {
                Logger.log('flags:');
                for (const i in this.parser.flags) {
                    Logger.log(`\t--${i}${'shortHand' in this.parser.flags[i] && this.parser.flags[i].shortHand ? `|-${this.parser.flags[i].shortHand}` : ''}`);
                    Logger.log(`\t${'description' in this.parser.flags[i] ? this.parser.flags[i].description : ''}\n`);
                }
            }
            Logger.log('\n*******************************************\n');
        }
    }
}
