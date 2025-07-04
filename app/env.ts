import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    BASE_URL: z.string().url().default('http://localhost:3000'),
    CONTENT_UNSTORAGE_DRIVER: z.enum(['fs', 'github']).default('fs'),
    CONTENT_UNSTORAGE_FS_BASE: z.string().default('example/content'),
    CONTENT_UNSTORAGE_GITHUB_REPO: z.string().optional(),
    CONTENT_UNSTORAGE_GITHUB_BRANCH: z.string().default('main'),
    CONTENT_UNSTORAGE_GITHUB_DIR: z.string().default('/'),
    CONTENT_UNSTORAGE_GITHUB_TOKEN: z.string().optional(),
    CONTENT_UNSTORAGE_INIT_DB_SQL: z.string().default('initdb.d:init.sql'),
    CONTENT_UNSTORAGE_DATASET_METADATA: z.string().default('metadata.md'),
  },
  runtimeEnv: {
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    CONTENT_UNSTORAGE_DRIVER: process.env.CONTENT_UNSTORAGE_DRIVER,
    CONTENT_UNSTORAGE_FS_BASE: process.env.CONTENT_UNSTORAGE_FS_BASE,
    CONTENT_UNSTORAGE_GITHUB_REPO: process.env.CONTENT_UNSTORAGE_GITHUB_REPO,
    CONTENT_UNSTORAGE_GITHUB_BRANCH:
      process.env.CONTENT_UNSTORAGE_GITHUB_BRANCH,
    CONTENT_UNSTORAGE_GITHUB_DIR: process.env.CONTENT_UNSTORAGE_GITHUB_DIR,
    CONTENT_UNSTORAGE_GITHUB_TOKEN: process.env.CONTENT_UNSTORAGE_GITHUB_TOKEN,
    CONTENT_UNSTORAGE_INIT_DB_SQL: process.env.CONTENT_UNSTORAGE_INIT_DB_SQL,
    CONTENT_UNSTORAGE_DATASET_METADATA: process.env.CONTENT_UNSTORAGE_DATASET,
  },
});
