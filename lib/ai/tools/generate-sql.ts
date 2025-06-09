import { env } from '@/app/env';
import { user } from '@/lib/db/schema';
import { createDBClient } from '@/lib/duckdb/client';
import { customProvider, generateObject, tool } from 'ai';
import { z } from 'zod';
import { myProvider } from '@/lib/ai/providers';
import { syntaxPrompt } from '../duckdb-prompt';

export const generateSQL = tool({
  description: 'Generate SQL queries based on user input',
  parameters: z.object({
    userInput: z.string().describe('The user input for generating SQL queries'),
  }),
  execute: async ({ userInput }) => {
    try {
      const { object } = await generateObject({
        model: myProvider.languageModel('sql-model'),
        system: `You are helpful assistant to generate SQL Query.\n${syntaxPrompt}`,
        prompt: userInput,
        schema: z.object({
          sql: z.string().describe('The generated SQL query'),
        }),
      });
      console.log('Generated SQL:', object);
      return object;
    } catch (error) {
      console.error('Error generating SQL:', error);
      throw new Error('Failed to generate SQL query');
    }
  },
});

async function validateSQL(query: string) {
  const cli = await createDBClient({
    initSqlDir: env.INIT_DB_DIR,
    initSqlFile: env.INIT_DB_SQL,
  });
  try {
    await cli.query(query);
    return true;
  } catch (error) {
    console.error('SQL validation error:', error);
    return false;
  }
}
