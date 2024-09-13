import { commands } from './commands';
import { FatalError } from './lib/error';
import { Logger } from './lib/logger';
import { Parser } from './lib/parser';
import { getConfig } from './utils/config';
export function cli(args) {
    const parsed = { ...Parser.init(...args) };
    const ctx = {
        ...parsed,
        arguments: {
            arguments: {},
            flags: {},
            parameters: {},
        },
    };
    if (ctx.command === null) {
        Logger.error('no command provided');
        process.exit(1);
    }
    if ((ctx.command !== '--version' && ctx.command !== '-v' && !commands.has(ctx.command))) {
        Logger.error('invalid command');
        process.exit(1);
    }
    const command = (ctx.command === '--version' || ctx.command === '-v')
        ? 'printversion'
        : ctx.command;
    getConfig()
        .then(config => {
        console.log('config loaded...importing command');
        ctx.config = config;
        return import(`./commands/${command}`);
    })
        .then((module) => {
        console.log('executing module');
        return module.exec(ctx);
    })
        .then((ctx) => {
        console.log('cleaning up');
        if ('preventCompletion' in ctx && ctx.preventCompletion) {
            return ctx;
        }
        else {
            // do some cleanup here
        }
    })
        .catch((err) => {
        Logger.error(err);
        if (err instanceof FatalError)
            process.exit(1);
    });
}
