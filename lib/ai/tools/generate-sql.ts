import { env } from '@/app/env';
import { myProvider } from '@/lib/ai/providers';
import { createDBClient } from '@/lib/duckdb/client';
import { generateObject, tool } from 'ai';
import { z } from 'zod';
import { syntaxPrompt } from '../duckdb-prompt';
import { google, GoogleGenerativeAIProviderOptions } from '@ai-sdk/google';

export const generateQueryTool = tool({
  description: 'Generate SQL queries based on user input',
  parameters: z.object({
    userInput: z.string().describe('The user input for generating SQL queries'),
    chartType: z
      .enum(['bar', 'line', 'pie'])
      .optional()
      .describe('The type of chart to generate SQL for'),
  }),
  execute: async ({ userInput }) => {
    try {
      const { object } = await generateQuery({
        userInput,
        schema,
      });
      return object;
    } catch (error) {
      console.error('Error generating SQL:', error);
      throw new Error('Failed to generate SQL query');
    }
  },
});

async function _validateSQL(query: string) {
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

export async function generateQuery({
  userInput,
  schema,
}: {
  userInput: string;
  schema: string;
}) {
  return generateObject({
    model: myProvider.languageModel('sql-model'),
    system: `You are helpful assistant to generate SQL Query.
${syntaxPrompt}
---
MUST follow the schema below to generate SQL queries.
\`\`\`json
${schema}
\`\`\`
---
determine the type of chart to generate SQL for based on the user input.
`,
    prompt: userInput,
    schema: z.object({
      sql: z.string().describe('The generated SQL query'),
      chartType: z
        .enum(['bar', 'line', 'pie'])
        .describe('The type of chart to generate SQL for'),
    }),
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingBudget: 2048,
        },
      } satisfies GoogleGenerativeAIProviderOptions,
    },
  });
}
