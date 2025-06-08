// import rehypeShiki from '@shikijs/rehype'
import { compileMDX } from 'next-mdx-remote/rsc';
// import rehypeAutolinkHeadings from 'rehype-autolink-headings'
// import rehypeSlug from 'rehype-slug'
// import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm';
// import remarkMath from 'remark-math'
// import remarkParse from 'remark-parse'

export async function compileMdx2(
  mdxSource: string,
  scope: any,
  components: any,
) {
  const { content } = await compileMDX({
    source: mdxSource,
    options: {
      scope,
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          // remarkParse,  remarkMath, remarkBreaks
        ],
        // rehypePlugins: [
        //   [
        //     rehypeShiki,
        //     {
        //       themes: {
        //         light: 'github-dark',
        //         dark: 'github-dark',
        //       },
        //       langs: [
        //         'typescript',
        //         'bash',
        //         'diff',
        //         'docker',
        //         'go',
        //         'javascript',
        //         'json',
        //         'makefile',
        //         'python',
        //         'sql',
        //         'yaml',
        //         'markdown',
        //         'hcl',
        //       ],
        //     },
        //   ],
        //   rehypeSlug,
        //   [
        //     rehypeAutolinkHeadings,
        //     {
        //       behavior: 'before',
        //     },
        //   ],
        // ],
        format: 'mdx',
      },
      parseFrontmatter: true,
    },
    components,
  });
  return content;
}
