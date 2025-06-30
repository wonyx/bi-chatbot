import type { ArtifactKind } from '@/components/artifact';

export const artifactsPrompt = `
Artifacts is a special user interface mode that helps users with writing, editing, and data analytics report creation tasks. When artifact is open, it is on the right side of the screen, while the conversation is on the left side. When creating or updating documents, changes are reflected in real-time on the artifacts and visible to the user.

DO NOT UPDATE DOCUMENTS IMMEDIATELY AFTER CREATING THEM. WAIT FOR USER FEEDBACK OR REQUEST TO UPDATE IT.

This is a guide for using artifacts tools: \`createDocument\` and \`updateDocument\`, which render content on a artifacts beside the conversation.

**When to use \`createDocument\`:**
- For substantial content (>10 lines)
- For content users will likely save/reuse (data analytics report, etc.)
- When explicitly requested to create a document

**When NOT to use \`createDocument\`:**
- For informational/explanatory content
- For conversational responses
- When asked to keep it in chat

**Using \`updateDocument\`:**
- Default to full document rewrites for major changes
- Use targeted updates only for specific, isolated changes
- Follow user instructions for which parts to modify


`;

export const regularPrompt =
  'You are a friendly assistant! Keep your responses concise and helpful.';

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
export interface RequestHints {
  // latitude: Geo['latitude'];
  // longitude: Geo['longitude'];
  // city: Geo['city'];
  // country: Geo['country'];
}

// export const getRequestPromptFromHints = (requestHints: RequestHints) => `\
// About the origin of user's request:
// - lat: ${requestHints.latitude}
// - lon: ${requestHints.longitude}
// - city: ${requestHints.city}
// - country: ${requestHints.country}
// `;

export const systemPrompt = ({
  selectedChatModel,
  requestHints,
}: {
  selectedChatModel: string;
  requestHints: RequestHints;
}) => {
  // const requestPrompt = getRequestPromptFromHints(requestHints);
  const requestPrompt = ``;

  if (selectedChatModel === 'chat-model-reasoning') {
    return `${regularPrompt}\n\n${requestPrompt}`;
  } else {
    return `${regularPrompt}\n\n${requestPrompt}\n\n${artifactsPrompt}`;
  }
};

export const reportPrompt = `
You are a report generation assistant. Create a data analysis report based on the given prompt.

<workflow>
1. call \`listTables\` to get the list of tables and schema in the database.
2. call \`planGenerateReport\` to create a plan for the report based on the prompt and the list of tables.
3. call \`generateSQL\` to generate SQL queries based on the plan.
</workflow>
`;

export const updateDocumentPrompt = (
  currentContent: string | null,
  type: ArtifactKind,
) =>
  type === 'report'
    ? `\
Improve the following report based on the given prompt.
${currentContent}
`
    : '';

export const chartTypePrompt = `\
<ChartType>
determine the type of chart to generate SQL for based on the user input.

- If a chart type is specified in the user's instructions, that type will be used.
- **Bar Chart**
    Bar charts use vertical or horizontal bars to represent data, making it easy to compare values across categories.
- **Line Chart**
    Line charts display data points connected by lines, making it easy to observe trends over time.
- **Area Chart**
    Area charts share some similarities with these other chart types, but they excel at displaying the volume or magnitude of data changes.
- **Pie Chart**
    Pie charts use a circular graph to visually represent data proportions, showing the ratio of each part to the whole.
</ChartType>
`;
