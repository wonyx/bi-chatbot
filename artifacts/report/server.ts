import { env } from '@/app/env';
import { reportPrompt } from '@/lib/ai/prompts';
import { myProvider } from '@/lib/ai/providers';
import { generateQuery } from '@/lib/ai/tools/generate-sql';
import { createDocumentHandler } from '@/lib/artifacts/server';
import { createDBClient } from '@/lib/duckdb/client';
import { sharedChartPropsSchema } from '@/lib/zod-schema';
import { generateObject } from 'ai';
import matter, { stringify } from 'gray-matter';

export const customDocumentHandler = createDocumentHandler<'report'>({
  kind: 'report',
  // Called when the document is first created.
  onCreateDocument: async ({ title, message, dataStream }) => {
    try {
      let draftContent = '';

      const cli = await createDBClient({
        initSqlDir: env.INIT_DB_DIR,
        initSqlFile: env.INIT_DB_SQL,
      });
      console.log('Creating report', title, message);
      const schema = await cli.getSchema();
      // For demonstration, use streamText to generate content.
      const { object } = await generateQuery({
        userInput: message,
        schema: JSON.stringify(schema),
      });
      console.log('generateQuery res:', object);

      draftContent = createReportMdx({
        title,
        id: 'report1',
        query: object.sql,
        chartType: object.chartType,
        chartProps: object.chartProps,
      });

      dataStream.writeData({
        type: 'text-delta',
        content: draftContent,
      });
      return draftContent;
    } catch (error) {
      console.error('Error creating document:', error);
      dataStream.writeData({
        type: 'text-delta',
        content: `Error creating document: ${error}`,
      });
      throw error;
    }
  },
  // Called when updating the document based on user modifications.
  onUpdateDocument: async ({ document, description, dataStream }) => {
    let draftContent = '';

    if (!document.content) {
      throw new Error('Document content is empty');
    }
    const report = matter(document.content);

    const cli = await createDBClient({
      initSqlDir: env.INIT_DB_DIR,
      initSqlFile: env.INIT_DB_SQL,
    });
    console.log('Updating report', document.title, description);
    const schema = await cli.getSchema();
    // For demonstration, use smoothStream to generate content.

    const { object } = await generateQuery({
      userInput: description,
      schema: JSON.stringify(schema),
      current: {
        sql: report.data.sql.report1.content,
        chartType: report.data.chart.report1.type,
      },
    });
    console.log('generateQuery res:', object);
    const { object: chartProps } = await generateChartProps({
      chartType: object.chartType,
    });

    draftContent = createReportMdx({
      title: report.data.title,
      id: 'report1',
      query: object.sql,
      chartType: object.chartType,
      chartProps,
    });

    return draftContent;
  },
});

async function generateChartProps({
  chartType,
}: {
  chartType: 'bar' | 'line' | 'area' | 'pie';
}) {
  switch (chartType) {
    case 'bar':
    case 'line':
    case 'area':
      return generateObject({
        model: myProvider.languageModel('artifact-model'),
        system: reportPrompt,
        prompt: `Generate chart properties for a ${chartType} chart.`,
        schema: sharedChartPropsSchema,
      });
    case 'pie':
    default:
      throw new Error(`Unsupported chart type: ${chartType}`);
  }
}
function createReportMdx(args: {
  title: string;
  id: string;
  query: string;
  chartType?: 'bar' | 'line' | 'area' | 'pie';
  chartProps: Record<string, any>;
}) {
  const { title, id, query, chartType } = args;
  let content = '';
  switch (chartType) {
    case 'bar':
      content = `
<BarChart
  {...frontmatter.chart.${id}}
  {...props.data.${id}}
/>
`;
      break;
    case 'line':
      content = `
<LineChart
  {...frontmatter.chart.${id}}
  {...props.data.${id}}
/>
`;
      break;
    case 'pie':
      content = `
<PieChart
  {...frontmatter.chart.${id}}
  {...props.data.${id}}
/>`;
      break;
    default:
      throw new Error(`Unsupported chart type: ${chartType}`);
  }

  return stringify(content, {
    title,
    sql: {
      [id]: {
        content: query,
      },
    },
    chart: {
      [id]: {
        ...args.chartProps,
        type: chartType,
      },
    },
  });
}
