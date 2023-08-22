export class Logger {
    static log(...args) {
        console.log(...args);
    }
    static error(...args) {
        console.error('[-] ', ...args);
    }
    static success(...args) {
        console.error('[+] ', ...args);
    }
    static warning(...args) {
        console.error('[!] ', ...args);
    }
}
