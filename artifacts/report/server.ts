import { env } from '@/app/env';
import { reportPrompt, updateDocumentPrompt } from '@/lib/ai/prompts';
import { myProvider } from '@/lib/ai/providers';
import { generateQuery } from '@/lib/ai/tools/generate-sql';
import { listTables } from '@/lib/ai/tools/list-tables';
import { createDocumentHandler } from '@/lib/artifacts/server';
import { createDBClient } from '@/lib/duckdb/client';
import { smoothStream, streamText } from 'ai';

export const customDocumentHandler = createDocumentHandler<'report'>({
  kind: 'report',
  // Called when the document is first created.
  onCreateDocument: async ({ title, message, description, dataStream }) => {
    let draftContent = '';

    const cli = await createDBClient({
      initSqlDir: env.INIT_DB_DIR,
      initSqlFile: env.INIT_DB_SQL,
    });
    console.log('Creating report', title, message, description);
    const schema = await cli.getSchema();
    // For demonstration, use streamText to generate content.
    const { object } = await generateQuery({
      userInput: message,
      schema: JSON.stringify(schema),
    });

    // Stream the content back to the client.
    // for await (const delta of fullStream) {
    //   console.log('Delta received:', delta);
    //   if (delta.type === 'text-delta') {
    //     draftContent += delta.textDelta;
    //     dataStream.writeData({
    //       type: 'content-update',
    //       content: delta.textDelta,
    //     });
    //   }
    // }

    return JSON.stringify({
      title,
      query: object.sql,
      description,
    });
  },
  // Called when updating the document based on user modifications.
  onUpdateDocument: async ({ document, description, dataStream }) => {
    let draftContent = '';
    const { fullStream } = streamText({
      model: myProvider.languageModel('artifact-model'),
      system: updateDocumentPrompt(document.content, 'report'),
      experimental_transform: smoothStream({ chunking: 'word' }),
      prompt: description,
      experimental_providerMetadata: {
        openai: {
          prediction: {
            type: 'content',
            content: document.content,
          },
        },
      },
    });

    for await (const delta of fullStream) {
      if (delta.type === 'text-delta') {
        draftContent += delta.textDelta;
        dataStream.writeData({
          type: 'content-update',
          content: delta.textDelta,
        });
      }
    }

    return draftContent;
  },
});

function createReport(args: {
  title: string;
  description?: string;
  id: string;
  query: string;
  chart: {
    type: 'bar' | 'line' | 'pie';
    data: Array<{ label: string; value: number }>;
  };
});
