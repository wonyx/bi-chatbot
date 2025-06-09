import { z } from 'zod'

const frontmatterSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  layout: z.enum(['portrait', 'landscape']).default('portrait'),
  data: z
    .record(
      z.object({
        dataset: z
          .object({
            dimensions: z.array(z.object({ name: z.string() })),
            source: z.array(z.any()),
          })
          .optional(),
      }),
    )
    .optional()
    .nullable(),
  sql: z
    .record(
      z.object({
        description: z.string().optional(),
        content: z.string().nullable().optional(),
      }),
    )
    .optional()
    .nullable(),
  searchParams: z
    .record(z.union([z.number(), z.string(), z.array(z.string())]))
    .optional()
    .nullable(),
})
export type Frontmatter = z.infer<typeof frontmatterSchema>
export const validateFrontmatter = (data: unknown): Frontmatter => {
  const result = frontmatterSchema.safeParse(data)
  if (!result.success) {
    throw new Error(`Invalid frontmatter: ${result.error}`)
  }
  return result.data
}
