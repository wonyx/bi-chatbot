import { env } from '@/app/env';
import { myProvider } from '@/lib/ai/providers';
import { createDBClient } from '@/lib/duckdb/client';
import { GoogleGenerativeAIProviderOptions } from '@ai-sdk/google';
import { generateObject, tool } from 'ai';
import { z } from 'zod';
import { syntaxPrompt } from '../duckdb-prompt';
import { sharedChartPropsSchema } from '@/lib/zod-schema';

export const generateQueryTool = tool({
  description: 'Generate SQL queries based on user input',
  parameters: z.object({
    userInput: z.string().describe('The user input for generating SQL queries'),
    schema: z.string().describe('The schema of the database in JSON format'),
  }),
  execute: async ({ userInput, schema }) => {
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
  const cli = await createDBClient(env);
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
  current?: {
    sql: string;
    chartType: 'bar' | 'line' | 'area' | 'pie';
  };
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

- If a chart type is specified in the user's instructions, that type will be used.
- **Bar Chart**
    Bar charts use vertical or horizontal bars to represent data, making it easy to compare values across categories.
- **Line Chart**
    Line charts display data points connected by lines, making it easy to observe trends over time.
- **Area Chart**
    Area charts share some similarities with these other chart types, but they excel at displaying the volume or magnitude of data changes.
- **Pie Chart**
    Pie charts use a circular graph to visually represent data proportions, showing the ratio of each part to the whole.

---
You need to consider the following when generating SQL queries:
- Ensure the SQL query is valid and can be executed against the provided schema.
- The SQL query should be optimized for performance and readability.
- The SQL query should be relevant to the user's input and the specified chart type.
- To specify a name for an output column in a SELECT statement, append \`AS <output_name>\` after the column expression. <output_name> is a placeholder. Please use a human-readable name for <output_name>, as it is typically used directly as a chart label.
- For bar, line, and area charts, the first column selected in the dataset is used as the labels. Therefore, please select the column for the labels first, followed by the columns for the data series, as shown in this example: SELECT x as LABEL, y as SERIES FROM table;
`,
    prompt: userInput,
    schema: z.object({
      sql: z.string().describe('The generated SQL query'),
      chartType: z
        .enum(['bar', 'line', 'area', 'pie'])
        .describe('The type of chart to generate SQL for'),
      chartProps: sharedChartPropsSchema.describe(
        'The properties of the chart to be generated',
      ),
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
