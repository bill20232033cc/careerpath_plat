import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'lib', 'data');
const locks = new Map<string, Promise<void>>();

function acquireLock(key: string): Promise<() => void> {
  let resolveLock: () => void;
  const prev = locks.get(key) || Promise.resolve();
  const next = new Promise<void>((resolve) => { resolveLock = resolve; });
  locks.set(key, next);
  return prev.then(() => resolveLock!);
}

export function readData<T>(filename: string): T[] {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

export async function writeData<T>(filename: string, data: T[]): Promise<void> {
  const release = await acquireLock(filename);
  try {
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } finally {
    release();
  }
}
