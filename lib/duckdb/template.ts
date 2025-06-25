import Mustache from 'mustache';
export async function renderString(str: string, _context: object) {
  return Mustache.render(str, _context);
}
