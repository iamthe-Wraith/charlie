/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from 'fs';
import { commands } from './cmds';
import { ConfigPath } from './constants';
import { Config } from './utils/config';

type CommandKeys = keyof typeof commands;

export function cli(args: string[]) {
  const [
    _,
    __,
    command,
  ] = args;

  if (!command) return console.error('[-] no command provided');

  if (!commands.hasOwnProperty(command)) {
    console.error('[-] invalid command.');
    console.log('\nif you need help, run `charlie help`');
    return;
  }

  fs.open(ConfigPath, 'r', async (err, fd) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error('[-] config file not found. please run `npm install`');
        return;
      }

      console.error('[-] error opening config file.');
      return;
    }

    try {
      const config = new Config();
      await config.load();

      await commands[command as CommandKeys].exec(args, config);

      /** global cleanup here */
    } catch(err: any) {
      console.error('[-] Uncaught Error');
      console.error(err);
    } finally {
      fs.close(fd, err => {
        if (err) {
          console.error('[-] error closing config file.');
          return;
        }
      });
    }
  });
}
