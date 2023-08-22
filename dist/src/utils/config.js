import fs from 'fs';
import { ConfigPath } from '../constants';
export class Config {
    constructor() {
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "load", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => new Promise((resolve, reject) => {
                if (this.config) {
                    // config has already been loaded.
                    return resolve(this.config);
                }
                fs.stat(ConfigPath, (statsError, stats) => {
                    if (statsError)
                        return reject(statsError);
                    // https://www.geeksforgeeks.org/node-js-fs-read-method/
                    fs.open(ConfigPath, 'r', (openError, fd) => {
                        if (openError)
                            return reject(openError);
                        // !!!: moved on due to time constraints
                        // TODO: come back to this and figure out actual typing.
                        const buffer = new Buffer.alloc(stats.size);
                        fs.read(fd, buffer, 0, buffer.length, null, (readError, _, buffer) => {
                            if (readError)
                                return reject(readError);
                            let data;
                            try {
                                const bufferData = buffer.toString('utf8');
                                data = JSON.parse(bufferData);
                            }
                            finally {
                                fs.close(fd, (err) => {
                                    if (err)
                                        throw err;
                                    resolve(data);
                                });
                            }
                        });
                    });
                });
            })
                .then((data) => {
                this.config = data;
            })
        });
    }
    get dirAliases() { return this.config?.dirAliases || {}; }
}
