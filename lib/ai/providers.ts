import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
// import { google } from '@ai-sdk/google';
import { vertex } from '@ai-sdk/google-vertex';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': vertex('gemini-2.5-flash'),
        'chat-model-reasoning': wrapLanguageModel({
          model: vertex('gemini-2.5-flash'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': vertex('gemini-2.5-flash'),
        'sql-model': vertex('gemini-2.5-flash'),
        'artifact-model': vertex('gemini-2.5-flash'),
      },
      imageModels: {
        // @ts-ignore
        'small-model': vertex('imagen-3.0-generate-002'),
      },
    });
