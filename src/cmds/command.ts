import { Parser } from '../utils/parser';

export abstract class Command {
  protected parser: Parser;

  constructor(parser: Parser) {
    this.parser = parser;
  }

  public get args() { return this.parser.args; }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public exec(args: string[]) {
    this.parser.parseArgumentsIntoOptions(args);
    return this.execCommand();
  }

  protected abstract execCommand(): Promise<void>;
}