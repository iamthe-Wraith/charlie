import { Parser } from '../utils/parser';
import { Command } from './command';

const parser = new Parser({
  '--count': Number,
  '--dir': String,
  '-c': '--count',
  '-d': '--dir',
});

class Random extends Command {
  constructor(p: Parser) {
    super(p);
  }

  protected async execCommand(): Promise<void> {
    console.log('GetRandomFile.execCommand()', this.args);
  }
}

export const random = new Random(parser);