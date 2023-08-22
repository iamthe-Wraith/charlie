import { readdir } from 'fs/promises';
import { FatalError } from '../lib/error';
import { IContext } from '../types';
import { Command } from './command';
import { Logger } from '../lib/logger';

const DefaultFilesCount = 5;

class ReviewCommand extends Command {
  constructor() {
    super({
      pattern: '<review> <directory>',
      docs: `
        Retrieves a list of N random filenames within the provided directory to be reviewed.`
    });

    this.argument('count|c', {
      type: 'int',
      description: `the number of random filenames to retrieve. (defaults to ${DefaultFilesCount})`
    });

    this.parameter('directory', {
      description: 'the alias for the directory to retrieve random filenames from. see dirAliases in ~/.charlie to configure aliases.'
    });
  }

  main = async (ctx: IContext): Promise<IContext> => {
    const dirAlias = ctx.arguments.parameters.directory;
    const count = ctx.arguments.arguments.count || DefaultFilesCount;

    if (!ctx.config!.dirAliases[dirAlias]) {
      throw new FatalError(`directory alias '${dirAlias}' not found in ~/.charlie`);
    }

    const dir = ctx.config!.dirAliases[dirAlias];

    const files = await readdir(dir);

    const filesToReview = new Set<string>();

    while(filesToReview.size < count) {
      const randomIndex = Math.floor(Math.random() * files.length);

      let file: string;

      if (ctx.arguments.flags.extensions) {
        file = files[randomIndex];
      } else {
        const parts = files[randomIndex].split('.');
        parts.pop();
        file = parts.join('.');
      }

      filesToReview.add(file);
    }

    Logger.log(`${filesToReview.size} files to review:\n`);
    filesToReview.forEach(file => Logger.log(file));

    return ctx;
  };
}

const reviewCommand = new ReviewCommand();

export const exec = (ctx: IContext): Promise<IContext> => reviewCommand.execute(ctx);
export const help = () => reviewCommand.help();