import { Parser } from '../utils/parser';
import { Command } from './command';
const parser = new Parser({
    '--count': Number,
    '--dir': String,
    '-c': '--count',
    '-d': '--dir',
});
class Review extends Command {
    constructor(p) {
        super(p);
    }
    async execCommand() {
        try {
            this.validate();
            const dir = this.getDir();
            console.log('[+] Reviewing files for dir: ', dir);
        }
        catch (err) {
            console.log(`[-] ${err.message}`);
        }
    }
    getDir() {
        if (!this.args)
            return null;
        const dir = this.args['--dir'] || this.args['-d'];
        // retrieve dir path from config here.
        return dir;
    }
    validate() {
        if (!this.args)
            throw new Error('No arguments provided');
        if (!this.args['--dir'] && !this.args['-d'])
            throw new Error('No directory provided');
        if ((this.args['--count'] && isNaN(this.args['--count'])) || (this.args['-c'] && isNaN(this.args['-c'])))
            throw new Error('Invalid count provided');
        if (typeof this.args['--count'] !== 'number' || typeof this.args['-c'] !== 'number')
            throw new Error('Invalid count provided');
    }
}
export const review = new Review(parser);
