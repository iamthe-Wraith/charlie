import path from 'path';
import os from 'os';

export const HomeDir = os.homedir();
export const ConfigPath = path.resolve(HomeDir, '.charlie');