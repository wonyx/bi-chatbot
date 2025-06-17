import 'server-only';
import { Storage, createStorage, prefixStorage } from 'unstorage';
import fsDriver from 'unstorage/drivers/fs-lite';
import githubDriver from 'unstorage/drivers/github';

export function createContentStorage(env: any) {
  const source = env.CONTENT_UNSTORAGE_DRIVER;
  let storage: Storage;
  switch (source) {
    case 'github': {
      if (!env.CONTENT_UNSTORAGE_GITHUB_REPO) {
        throw new Error('GITHUB_REPO is required');
      }
      storage = createStorage({
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
      storage = createStorage({
        driver: fsDriver({
          base: env.CONTENT_UNSTORAGE_FS_BASE,
        }),
      });
      break;
  }
  return {
    keys: () => storage.keys(),
    has: (key: string) => storage.has(key),
    getItemRaw: (key: string) => storage.getItemRaw(key),
    getContent: async (key: string, prefix?: string) => {
      const _ps = prefix ? prefixStorage(storage, prefix) : storage;
      const item = await storage.getItemRaw(key);
      if (!item) {
        throw new Error(`not found: ${key}, prefix: ${prefix}`);
      }
      return item.toString();
    },
  };
}

export type ContentStorage = ReturnType<typeof createContentStorage>;
