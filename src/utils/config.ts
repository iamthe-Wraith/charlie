import fs from 'fs';
import { ConfigPath } from '../constants';

export interface IConfig {
  dirAliases: Record<string, string>;
}

export class Config {
  private config: IConfig | null = null;

  public get dirAliases() { return this.config?.dirAliases || {}; }

  public load = () => new Promise<IConfig>((resolve, reject) => {
    if (this.config) {
      // config has already been loaded.
      return resolve(this.config);
    }

    fs.stat(ConfigPath, (statsError, stats) => {
      if (statsError) return reject(statsError);
  
      // https://www.geeksforgeeks.org/node-js-fs-read-method/
      fs.open(ConfigPath, 'r', (openError, fd) => {
        if (openError) return reject(openError);
  
        // !!!: moved on due to time constraints
        // TODO: come back to this and figure out actual typing.
        const buffer = new (Buffer as any).alloc(stats.size);
  
        fs.read(fd, buffer, 0, buffer.length, null, (readError, _, buffer) => {
          if (readError) return reject(readError);
          let data: IConfig;
  
          try {
            const bufferData = buffer.toString('utf8');
            data = JSON.parse(bufferData);
          } finally {
            fs.close(fd, (err) => {
              if (err) throw err;

              resolve(data);
            });
          }
        });
      });
    });
  })
    .then((data: IConfig) => {
      this.config = data;
    });
}
