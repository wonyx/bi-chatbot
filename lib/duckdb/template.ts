import nunjucks from 'nunjucks'

export async function renderString(str: string, context: object) {
  return nunjucks.renderString(str, context)
}
