// import Anthropic from "@anthropic-ai/sdk";
import { FatalError } from '../lib/error';
import { IContext } from '../types';
import { Command } from './command';
import { Logger } from '../lib/logger';

const MaxTokensAllowed = 5000;
const DefaultMaxTokens = 1000;
// const DefaultTemperature = 0;

class QQCommand extends Command {
  constructor() {
    super({
      pattern: '<qq> <prompt>',
      docs: `
        Ask AI a question.`
    });

    this.argument('max-tokens|m', {
      type: 'int',
      description: `the maximum number of tokens the AI should generate.`
    });

    this.argument('system|s', {
      type: 'string',
      description: `addition system information to send to the AI. (Example: "Respond only with numbers")`
    });

    this.argument('temperature|t', {
      type: 'int',
      description: `the temperature of the AI's response.`
    });

    this.parameter('prompt', {
      description: 'the prompt to send to the AI.'
    });
  }

  main = async (ctx: IContext): Promise<IContext> => {
    console.log('QQCommand.main');

    // const prompt = ctx.arguments.parameters.prompt;
    // const temperature = ctx.arguments.arguments.temperature || DefaultTemperature;
    // const system = ctx.arguments.arguments.system;

    console.log('ctx', ctx.arguments.arguments);

    let maxTokens = ctx.arguments.arguments['max-tokens'] || DefaultMaxTokens;
    if (maxTokens > MaxTokensAllowed) maxTokens = MaxTokensAllowed;

    try {
      const msg = 'this is a test';

      console.log('apiKey', ctx.config!.apiKeys.anthropic);

      // const anthropic = new Anthropic({
      //   apiKey: ctx.config!.apiKeys.anthropic,
      // });

      // const request: Anthropic.Messages.MessageCreateParamsNonStreaming = {
      //   model: "claude-3-5-sonnet-20240620",
      //   max_tokens: maxTokens,
      //   temperature: temperature,
      //   messages: [
      //       {
      //         role: "user",
      //         content: [
      //           {
      //             type: "text",
      //             text: `${prompt}`
      //           }
      //         ]
      //       }
      //     ]
      // };

      // if (system) {
      //   request.system = `${system}`;
      // }

      // const msg = await anthropic.messages.create(request);

      Logger.log(msg);

      /* Response:
        {
            id: 'msg_01LsoWwEeue4ePUJaeJaC4EH',
            type: 'message',
            role: 'assistant',
            model: 'claude-3-5-sonnet-20240620',
            content: [ { type: 'text', text: '10' } ],
            stop_reason: 'end_turn',
            stop_sequence: null,
            usage: { input_tokens: 32, output_tokens: 5 }
        }
      */

      return ctx;
    } catch (err: unknown) {
      throw new FatalError(`qq:main error\n\n${(err as Error).message}`);
    }
  };
}

const qqCommand = new QQCommand();

export const exec = (ctx: IContext): Promise<IContext> => {
  try {
    return qqCommand.execute(ctx)
  } catch (err: unknown) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(err);
    console.log('<<<<<<<<<<<<<<<<<<<<<<<<');
    throw new FatalError(`qq:exec error\n\n${(err as Error).message}`);
  }
};
export const help = () => qqCommand.help();