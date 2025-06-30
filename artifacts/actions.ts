'use server';

import { env } from '@/app/env';
import { getSuggestionsByDocumentId } from '@/lib/db/queries';
import { newFileURL } from '@/lib/github/utils';
import { redirect } from 'next/navigation';
export async function getSuggestions({ documentId }: { documentId: string }) {
  const suggestions = await getSuggestionsByDocumentId({ documentId });
  return suggestions ?? [];
}

export async function addReportToGitHub({
  content,
  filename,
}: {
  content: string;
  filename: string;
}) {
  if (env.CONTENT_UNSTORAGE_DRIVER !== 'github') {
    throw new Error('GitHub storage is not configured');
  }
  if (!env.CONTENT_UNSTORAGE_GITHUB_REPO) {
    throw new Error('GitHub repository is not configured');
  }
  const url = newFileURL({
    repo: env.CONTENT_UNSTORAGE_GITHUB_REPO,
    branch: env.CONTENT_UNSTORAGE_GITHUB_BRANCH,
    path: env.CONTENT_UNSTORAGE_GITHUB_DIR,
    filename,
    value: content,
  });
  redirect(url);
}
