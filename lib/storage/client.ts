import 'server-only';
import { Storage, createStorage, prefixStorage } from 'unstorage';
import fsDriver from 'unstorage/drivers/fs-lite';
import githubDriver from 'unstorage/drivers/github';
import { GlobalRef } from '../global-ref';
const storage = new GlobalRef<Storage>('storage');

export function createContentStorage(env: any) {
  const source = env.CONTENT_UNSTORAGE_DRIVER;
  if (!storage.value) {
    switch (source) {
      case 'github': {
        if (!env.CONTENT_UNSTORAGE_GITHUB_REPO) {
          throw new Error('GITHUB_REPO is required');
        }
        storage.value = createStorage({
          driver: githubDriver({
            repo: env.CONTENT_UNSTORAGE_GITHUB_REPO,
            branch: env.CONTENT_UNSTORAGE_GITHUB_BRANCH,
            dir: env.CONTENT_UNSTORAGE_GITHUB_DIR,
            token: env.CONTENT_UNSTORAGE_GITHUB_TOKEN,
          }),
        });
        break;
      }
      default:
        storage.value = createStorage({
          driver: fsDriver({
            base: env.CONTENT_UNSTORAGE_FS_BASE,
          }),
        });
        break;
    }
  }
  return {
    keys: () => storage.value.keys(),
    has: (key: string) => storage.value.has(key),
    getItemRaw: (key: string) => storage.value.getItemRaw(key),
    getContent: async (key: string, prefix?: string) => {
      const _ps = prefix ? prefixStorage(storage.value, prefix) : storage;
      const item = await storage.value.getItemRaw(key);
      if (!item) {
        throw new Error(`not found: ${key}, prefix: ${prefix}`);
      }
      return item.toString();
    },
  };
}

export type ContentStorage = ReturnType<typeof createContentStorage>;
