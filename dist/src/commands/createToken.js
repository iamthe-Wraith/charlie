import { Command } from './command';
import { Logger } from '../lib/logger';
const DefaultLength = 36;
class CreateTokenCommand extends Command {
    constructor() {
        super({
            pattern: '',
            docs: 'Creates a randomly generated token.',
        });
        Object.defineProperty(this, "main", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (ctx) => {
                const length = ctx.arguments.arguments.count || DefaultLength;
                const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                let token = '';
                for (let i = 0; i < length; i++) {
                    token += chars[Math.floor(Math.random() * chars.length)];
                }
                Logger.log('New Token Generated:');
                Logger.log(token);
                return ctx;
            }
        });
        this.argument('length|l', {
            type: 'int',
            description: `the number of characters the token should be. (defaults to ${DefaultLength})`
        });
    }
}
const createTokenCommand = new CreateTokenCommand();
export const exec = (ctx) => createTokenCommand.execute(ctx);
export const help = () => createTokenCommand.help();
