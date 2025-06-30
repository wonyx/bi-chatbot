import { env } from '@/app/env';
import {
  generateMdxContent,
  generateQuery,
  updateMdxReport,
} from '@/lib/ai/tools/generate-sql';
import { createDocumentHandler } from '@/lib/artifacts/server';
import { createDBClient } from '@/lib/duckdb/client';
import { createContentStorage } from '@/lib/storage/client';
import { generateChartPropsSchema } from '@/lib/zod-schema';
import matter, { stringify } from 'gray-matter';

export const customDocumentHandler = createDocumentHandler<'report'>({
  kind: 'report',
  // Called when the document is first created.
  onCreateDocument: async ({ title, message, dataStream }) => {
    try {
      let draftContent = '';

      const cli = await createDBClient();
      console.log('Creating report', title, message);
      const schema = await cli.getSchema();
      const storage = await createContentStorage();
      const metadata = await storage.getContent(
        env.CONTENT_UNSTORAGE_DATASET_METADATA,
      );
      // For demonstration, use streamText to generate content.
      const { object } = await generateQuery({
        userInput: message,
        schema: JSON.stringify(schema),
        metadata: metadata,
      });
      console.log('generateQuery res:', object);

      draftContent = await createReportMdx({
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
    const mdxContent = matter(document.content);
    const cli = await createDBClient();
    const schema = await cli.getSchema();
    const storage = await createContentStorage();
    const metadata = await storage.getContent(
      env.CONTENT_UNSTORAGE_DATASET_METADATA,
    );

    let report: Awaited<ReturnType<typeof updateMdxReport>> | undefined;
    let lastQuery = '';
    let validationResult:
      | { isValid: boolean; errorMessage?: string }
      | undefined;
    while (!validationResult?.isValid) {
      report = await updateMdxReport({
        content: mdxContent.content,
        schema: JSON.stringify(schema),
        userInput: description,
        metadata: metadata,
        sqlError: validationResult?.errorMessage,
      });
      // Use report.object.sql for validation
      lastQuery = report.object?.sql || '';
      validationResult = await validateSQL(lastQuery);
    }
    console.log('Parsed report:', report, generateChartPropsSchema.toString());
    if (!report) throw new Error('Report was not generated');
    draftContent = await createReportMdx({
      title: document.title,
      id: `report1`,
      query: report.object?.sql || '',
      chartType: report.object.chartType,
      chartProps: report.object.chartProps,
    });
    return draftContent;
  },
});

async function createReportMdx(args: {
  title: string;
  id: string;
  query: string;
  chartType: 'bar' | 'line' | 'area' | 'pie';
  chartProps: Record<string, any>;
}) {
  const { title, id, query, chartType } = args;
  const content = await generateMdxContent({
    chartType: chartType,
    chartProps: args.chartProps,
  });

  return stringify(content.text, {
    title,
    sql: {
      [id]: {
        content: query,
      },
    },
  });
}
async function validateSQL(
  query: string,
): Promise<{ isValid: boolean; errorMessage?: string }> {
  const cli = await createDBClient();
  try {
    await cli.query(query);
    return { isValid: true };
  } catch (error) {
    console.error('SQL validation error:', error);
    // @ts-ignore
    return { isValid: false, errorMessage: error.message };
  }
}
