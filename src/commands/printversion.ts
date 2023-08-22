import fs from 'fs';
import path from 'path';
import { Command } from './command';
import { IContext } from '../types';
import { Logger } from '../lib/logger';

class PrintVersionCommand extends Command {
  constructor() {
    super({
      pattern: '<printversion>',
      docs: `
        prints the current version of Charlie`
    });
  }

  main = async (ctx: IContext): Promise<IContext> => {
    let version = '';

    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(require.main!.filename, '..', '..', 'package.json'), 'utf8'));
      version = `v${packageJson.version}`;
    } catch (err: any) {
      Logger.error(`printversion:main error\n\nunable to retrieve charlie version\n${err.message}`);
    }

    Logger.log(`Charlie ${version}`);

    return ctx;
  };
}

const printVersionCommand = new PrintVersionCommand();

export const exec = (ctx: IContext): Promise<IContext> => printVersionCommand.execute(ctx);