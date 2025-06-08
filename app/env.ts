import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    CONTENT_UNSTORAGE_DRIVER: z.enum(['fs', 'github']).default('fs'),
    CONTENT_UNSTORAGE_FS_BASE: z.string().default('example/content'),
    CONTENT_UNSTORAGE_GITHUB_REPO: z.string().optional(),
    CONTENT_UNSTORAGE_GITHUB_BRANCH: z.string().default('main'),
    CONTENT_UNSTORAGE_GITHUB_DIR: z.string().default('/'),
    CONTENT_UNSTORAGE_GITHUB_TOKEN: z.string().optional(),
    // AI_PROVIDER: z.enum(['ollama', 'google']).default('google'),
    // AI_MODEL: z.string().optional(),
    // GEMINI_API_KEY: z.string().optional(),
    // OLLAMA_API_URL: z.string().default('http://localhost:11434'),
    // INIT_DB_DIR: z.string().default('example/initdb.d'),
    // INIT_DB_SQL: z.string().default('init.sql'),
  },
  runtimeEnv: {
    CONTENT_UNSTORAGE_DRIVER: process.env.CONTENT_UNSTORAGE_DRIVER,
    CONTENT_UNSTORAGE_FS_BASE: process.env.CONTENT_UNSTORAGE_FS_BASE,
    CONTENT_UNSTORAGE_GITHUB_REPO: process.env.CONTENT_UNSTORAGE_GITHUB_REPO,
    CONTENT_UNSTORAGE_GITHUB_BRANCH:
      process.env.CONTENT_UNSTORAGE_GITHUB_BRANCH,
    CONTENT_UNSTORAGE_GITHUB_DIR: process.env.CONTENT_UNSTORAGE_GITHUB_DIR,
    CONTENT_UNSTORAGE_GITHUB_TOKEN: process.env.CONTENT_UNSTORAGE_GITHUB_TOKEN,
    // AI_PROVIDER: process.env.AI_PROVIDER,
    // AI_MODEL: process.env.AI_MODEL,
    // GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    // OLLAMA_API_URL: process.env.OLLAMA_API_URL,
    // INIT_DB_DIR: process.env.INIT_DB_DIR,
    // INIT_DB_SQL: process.env.INIT_DB_SQL,
  },
});
