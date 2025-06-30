import path from 'node:path';
export function newFileURL(input: {
  repo: string;
  branch: string;
  path: string;
  filename: string;
  value: string;
}) {
  const { repo, branch, path: pathname, filename, value } = input;
  const url = path.join(repo, 'new', branch, pathname);
  const newURL = new URL(url, 'https://github.com/');
  newURL.searchParams.set('filename', filename);
  newURL.searchParams.set('value', value);
  return newURL.toString();
}
