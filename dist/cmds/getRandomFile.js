import { Parser } from '../utils/parser';
import { Command } from './command';
const parser = new Parser({
    '--dir': String,
    '-d': '--dir',
});
class GetRandomFile extends Command {
    constructor(p) {
        super(p);
    }
    async execCommand() {
        console.log('GetRandomFile.execCommand()');
    }
}
export const getRandomFile = new GetRandomFile(parser);
