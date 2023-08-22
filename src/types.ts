interface IArguments {
  arguments: Record<string, any>;
  flags: Record<string, boolean>;
  parameters: Record<string, any>;
}

export interface IConfig {
  dirAliases: Record<string, string>;
}

export interface IContext {
  args: string[];
  arguments: IArguments;
  command: string | null;
  config?: IConfig;
  namespace: string;
}