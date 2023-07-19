/* eslint-disable @typescript-eslint/no-unused-vars */
import { commands } from './cmds';
export function cli(args) {
    const [_, __, command,] = args;
    if (!command)
        return console.error('[-] no command provided');
    if (!commands.hasOwnProperty(command)) {
        console.error('[-] invalid command.');
        console.log('\nif you need help, run `charlie --help`');
        return;
    }
    commands[command].exec(args)
        .then(() => {
        /** global cleanup here */
    })
        .catch(err => {
        console.error('\n[-] Uncaught Error\n');
        console.error(err);
    });
}
