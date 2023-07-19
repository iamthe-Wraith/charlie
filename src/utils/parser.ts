import arg, { Result } from 'arg';

export class Parser {
  private _args: Result<arg.Spec> | null = null;
  private _config: arg.Spec;

  constructor(config: arg.Spec) {
    this._config = config;
  }

  public get args() { return this._args; }
  public get config() { return this._config; } 

  parseArgumentsIntoOptions(rawArgs: string[]) {
    this._args = arg(
      this._config,
      {
        argv: rawArgs.slice(2),
      }
    );
  }
}