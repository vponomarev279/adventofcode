import fs, { promises } from 'node:fs';

export async function readFile(path: string): Promise<string> {
  return promises.readFile(path, { encoding: 'utf8' });
}

export function writeFile(path: string, content: string) {
  return promises.writeFile(path, content);
}

export function appendFile(path: string, content: string) {
  return fs.appendFileSync(path, content);
}
