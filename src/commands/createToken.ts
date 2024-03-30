import { IContext } from '../types';
import { Command } from './command';
import { Logger } from '../lib/logger';

const DefaultLength = 36;

class CreateTokenCommand extends Command {
  constructor() {
    super({
      pattern: '',
      docs: 'Creates a randomly generated token.',
    });

    this.argument('length|l', {
      type: 'int',
      description: `the number of characters the token should be. (defaults to ${DefaultLength})`
    });
  }

  main = async (ctx: IContext): Promise<IContext> => {
    const length = ctx.arguments.arguments.count || DefaultLength;
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    
    for(let i = 0; i < length; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }

    Logger.log('\nNew Token Generated:');
    Logger.log(token);

    return ctx;
  };
}

const createTokenCommand = new CreateTokenCommand();

export const exec = (ctx: IContext): Promise<IContext> => createTokenCommand.execute(ctx);
export const help = () => createTokenCommand.help();