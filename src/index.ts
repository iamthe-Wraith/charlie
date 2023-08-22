import { commands } from './commands';
import { FatalError } from './lib/error';
import { Logger } from './lib/logger';
import { Parser } from './lib/parser';
import { IContext } from './types';
import { getConfig } from './utils/config';

export function cli(args: [string, string, string, ...string[]]) {
  const parsed = { ...Parser.init(...args) };

  const ctx: IContext = {
    ...parsed,
    arguments: {
      arguments: {},
      flags: {},
      parameters: {},
    },
  };

  if (ctx.command === null ||
    (ctx.command !== '--version' && ctx.command !== '-v' && !commands.has(ctx.command))
  ) {
    Logger.error('\n[-] invalid command\n');
    process.exit(1);
  }

  const command = (ctx.command === '--version' || ctx.command === '-v')
    ? 'printversion'
    : ctx.command;

  getConfig()
    .then(config => {
      ctx.config = config;
      return import(`./commands/${command}`);
    })
    .then((module: any) => module.exec(ctx))
    .then((ctx: IContext) => {
      if ('preventCompletion' in ctx && ctx.preventCompletion) {
        return ctx;
      } else {
        // return Process.complete(ctx);
        Logger.log('complete...need to do some cleanup here...');
      }
    })
    .catch((err: Error) => {
      Logger.error(err.message);

      if (err instanceof FatalError) process.exit(1);
    });
}
