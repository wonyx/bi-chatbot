import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { google } from '@ai-sdk/google';
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
        'chat-model': google('gemini-2.5-flash-preview-04-17'),
        'chat-model-reasoning': wrapLanguageModel({
          model: google('gemini-2.5-flash-preview-04-17'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': google('gemini-2.5-flash-preview-04-17'),
        'artifact-model': google('gemini-2.5-flash-preview-04-17'),
      },
      imageModels: {
        'small-model': google('gemini-2.5-pro-preview-05-06'),
      },
    });
