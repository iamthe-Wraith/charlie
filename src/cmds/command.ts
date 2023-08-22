import { Config } from '../utils/config';
import { Parser } from '../utils/parser';

export abstract class Command {
  protected config: Config | null = null;
  protected parser: Parser;

  constructor(parser: Parser) {
    this.parser = parser;
  }

  public get args() { return this.parser.args; }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public exec(args: string[], config: Config) {
    this.config = config;
    this.parser.parseArgumentsIntoOptions(args);
    return this.execCommand();
  }

  protected abstract execCommand(): Promise<void>;
}