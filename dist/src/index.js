import { commands } from './commands';
import { FatalError } from './lib/error';
import { Logger } from './lib/logger';
import { Parser } from './lib/parser';
import { getConfig } from './utils/config';
const parsed = { ...Parser.init(...process.argv) };
const ctx = {
    ...parsed,
    config: await getConfig(),
};
if (ctx.command === null ||
    (ctx.command !== '--version' && ctx.command !== '-v' && !commands.has(ctx.command))) {
    Logger.error('\n[-] invalid command\n');
    process.exit(1);
}
const command = (ctx.command === '--version' || ctx.command === '-v')
    ? 'printversion'
    : ctx.command;
(await import(`./command/${command}`)).exec(ctx)
    .then((ctx) => {
    if ('preventCompletion' in ctx && ctx.preventCompletion) {
        return ctx;
    }
    else {
        // return Process.complete(ctx);
        Logger.log('complete...need to do some cleanup here...');
    }
})
    .catch((err) => {
    Logger.error(`\n${err.message}\n`);
    if (err instanceof FatalError)
        process.exit(1);
});
