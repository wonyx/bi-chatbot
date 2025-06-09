# Markdown format of Duckboard
The documentation for Duckboard is written in Markdown format, specifically using MDX (Markdown with JSX). This allows for a combination of Markdown content and React components, enabling dynamic and interactive reports.
## Frontmatter
schema:
```ts
z.object({
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
```

## SQL
SQL queries are defined in the frontmatter of the MDX file. The `sql` key contains a record of SQL queries, where each query has a name and a content string. The content string is the SQL query that will be executed to fetch data for the report.
## Charts
Charts are created using the `BarChart` component. The component takes several props to define the chart's appearance and behavior. The `x` prop specifies the x-axis label, and the `y` prop is an array of labels for the y-axis data series. The `stack` prop indicates whether the chart should be stacked.
### BarChart
example usage of the `BarChart` component:
```jsx
<BarChart
    x='年'
    y={['男性','女性']}
    stack
    {...data.japan_birth}
/>
```

## Example
whole example of an MDX file that includes SQL queries and a chart:
```mdx
---
title: Japan Birth Example
layout: landscape
sql:
    japan_birth:
        content:
            SELECT
                year as '年',
                birth_male as '男性',
                birth_female as '女性',
                birth_total as '合計',
                birth_male / NULLIF(birth_total,0) as '男性比率',
            FROM japan_birth 
            ORDER BY year
---

## 日本の出生数

<BarChart
    x='年'
    y={['男性','女性']}
    stack
    {...data.japan_birth}
/>
```