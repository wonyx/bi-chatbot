import { myProvider } from '@/lib/ai/providers';
import { generateChartPropsSchema } from '@/lib/zod-schema';
import { GoogleGenerativeAIProviderOptions } from '@ai-sdk/google';
import { generateObject, generateText, tool } from 'ai';
import { z } from 'zod';
import { syntaxPrompt } from '../duckdb-prompt';
import { chartTypePrompt } from '../prompts';

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

export async function generateQuery({
  userInput,
  schema,
  metadata,
}: {
  userInput: string;
  schema: string;
  metadata?: string;
}) {
  return generateObject({
    model: myProvider.languageModel('sql-model'),
    system: `You are helpful assistant to generate a Data Analytics Report.
<Definition>
- Data Analytics Report is a document that formatted MDX(Markdown + JSX).
- It contains SQL queries and visualizations based on the provided dataset.
- 
</Definition>
<SQLSyntax>
${syntaxPrompt}
</SQLSyntax>

MUST follow the schema below to generate SQL queries.
<SQLSchema>
${schema}
</SQLSchema>

<DetasetMetadata>
${metadata || 'No dataset metadata provided.'}
</DetasetMetadata>

<Instructions>
- ユーザの指示に基づいて、適切なデータセットを選びます。
  - もし、ユーザが特定のデータセットを指定していない場合は、最も関連性の高いデータセットを選択します。
  - もし、データがない場合は、適切なエラーメッセージを返します。
- ユーザの指示に基づいて、適切なチャートタイプを選びます。
  - ユーザがチャートタイプを指定していない場合は、最も適切なチャートタイプを選択します。
- ユーザの指示に基づいて、SQLクエリを生成します。
- ユーザの指示に基づいて、チャートのプロパティを生成します。

</Instructions>

<Chart>
<ChartType>
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
</ChartType>
</Chart>
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
      chartProps: generateChartPropsSchema.describe(
        'The properties of the chart to be generated',
      ),
      error: z
        .string()
        .optional()
        .describe('Error message if SQL generation fails'),
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

export async function updateMdxReport({
  content,
  userInput,
  schema,
  metadata,
  sqlError,
}: {
  content: string;
  userInput: string;
  schema: string;
  metadata?: string;
  sqlError?: string;
}) {
  const obj = await generateObject({
    model: myProvider.languageModel('artifact-model'),
    system: `You are a helpful assistant to update data analytics reports`,
    prompt: `Update the data analytics report content and extract the chart type and chart properties.
<UserInput>
${userInput}
</UserInput>
<MDXReport>
${content}
</MDXReport>

MUST follow the schema below to generate SQL queries.
<SQLSchema>
${schema}
</SQLSchema>

${sqlError ? `MUST FIX THE ERROR BELOW<SQLError>${sqlError}</SQLError>` : ''}

<DetasetMetadata>
${metadata || 'No dataset metadata provided.'}
</DetasetMetadata>

<Instructions>
- ユーザの指示に基づいて、適切なデータセットを選びます。
  - もし、ユーザが特定のデータセットを指定していない場合は、最も関連性の高いデータセットを選択します。
  - もし、データがない場合は、適切なエラーメッセージを返します。
- ユーザの指示に基づいて、適切なチャートタイプを選びます。
  - ユーザがチャートタイプを指定していない場合は、最も適切なチャートタイプを選択します。
- ユーザの指示に基づいて、SQLクエリを生成します。
- ユーザの指示に基づいて、チャートのプロパティを生成します。

</Instructions>

<Chart>
<ChartType>
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
</ChartType>
出力するチャートプロパティは、
</Chart>
---
You need to consider the following when generating SQL queries:
- Ensure the SQL query is valid and can be executed against the provided schema.
- The SQL query should be optimized for performance and readability.
- The SQL query should be relevant to the user's input and the specified chart type.
- To specify a name for an output column in a SELECT statement, append \`AS <output_name>\` after the column expression. <output_name> is a placeholder. Please use a human-readable name for <output_name>, as it is typically used directly as a chart label.
- For bar, line, and area charts, the first column selected in the dataset is used as the labels. Therefore, please select the column for the labels first, followed by the columns for the data series, as shown in this example: SELECT x as LABEL, y as SERIES FROM table;

`,
    schema: z.object({
      sql: z.string().describe('The generated SQL query'),

      chartType: z
        .enum(['bar', 'line', 'area', 'pie'])
        .describe('The type of chart in the report'),
      chartProps: generateChartPropsSchema.describe(
        'The properties of the chart in the report',
      ),
      error: z
        .string()
        .optional()
        .describe('Error message if SQL generation fails'),
    }),
  });
  return obj;
}
export async function generateMdxContent({
  chartType,
  chartProps,
}: {
  chartType: 'bar' | 'line' | 'area' | 'pie';
  chartProps: z.infer<typeof generateChartPropsSchema>;
}) {
  return await generateText({
    model: myProvider.languageModel('artifact-model'),
    system: `You are a helpful assistant to generate MDX content.
<Instructions>
- JUST add the chart component to the MDX content.
- DO NOT add frontmatter or any other content.
- MUST add \`{...props.data.report1}\` to the chart component. because the chart component will be called with props.data.report1.
</Instructions>
<ChartType>
${chartTypePrompt}
</ChartType>
<ChartPropsSchema>
${generateChartPropsSchema.toString()}
</ChartPropsSchema>

<Input>
${chartType} Chart

${JSON.stringify(chartProps, null, 2)}
</Input>
<Example>
Input: bar Chart
Output:
<BarChart
  x="xField"
  y="yField"
  y2={["y2Field1", "y2Field2"]}
  {...props.data.report1}
/>
</Example>
`,
    prompt: `Parse the MDX report content and extract the chart type, SQL query, and chart properties.`,
  });
}
