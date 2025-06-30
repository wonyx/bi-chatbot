import { z } from 'zod';

const frontmatterSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  layout: z.enum(['portrait', 'landscape']).default('portrait'),
  sql: z
    .record(
      z
        .string()
        .describe(
          'key of the SQL query, used in the report. this is MUST BE unique in the object.',
        ),
      z.object({
        description: z.string().optional(),
        content: z.string().nullable().optional(),
      }),
    )
    .optional()
    .nullable(),
});
export type Frontmatter = z.infer<typeof frontmatterSchema>;
export const validateFrontmatter = (data: unknown): Frontmatter => {
  const result = frontmatterSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid frontmatter: ${result.error}`);
  }
  return result.data;
};

export const chartTypeSchema = z
  .enum(['bar', 'line', 'area', 'pie'])
  .describe('Type of the chart to generate SQL for');

export type ChartType = z.infer<typeof chartTypeSchema>;

export const sharedChartPropsSchema = z.object({
  chartType: chartTypeSchema,
  dataset: z.any().describe('Dataset for the chart'),
  x: z.string().optional().describe('X-axis field name'),
  y: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe('Y-axis field name(s)'),
  y2: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe('Secondary Y-axis field name(s)'),
  y2SeriesType: z
    .enum(['line', 'bar'])
    .optional()
    .describe('Type of the secondary Y-axis series'),
  stack: z.boolean().optional().describe('Whether to stack the series'),
  horizontal: z
    .boolean()
    .optional()
    .describe('Whether the chart is horizontal'),
});

export type SharedChartProps = z.infer<typeof sharedChartPropsSchema>;
export const generateChartPropsSchema = sharedChartPropsSchema.omit({
  chartType: true,
  dataset: true,
});

export type GenerateChartProps = z.infer<typeof generateChartPropsSchema>;
