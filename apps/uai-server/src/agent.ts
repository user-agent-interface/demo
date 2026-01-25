import { tool, ToolLoopAgent, ToolSet } from 'ai';
import { z } from 'zod';

// Define the tools object separately so we can export its type
const agentTools = {
  shipments: tool({
    description: 'Show shipments',
    inputSchema: z.object({
      displayType: z.enum(['map', 'list']).default('map'),
      filter: z
        .enum(['inTransit', 'delayed', 'delivered'])
        .default('inTransit'),
    }),
  }),
} satisfies ToolSet;

export const uaiAgent = new ToolLoopAgent({
  model: 'openai/gpt-4o-mini',
  instructions: `
    You are a helpful assistant for building UI on-demand.
    Use tools (UI components) proactively to accomplish user goals,
    try to avoid asking the user for params that can be obtained via other tools.

    Tool parameter rules:
    - Get required params from other tools when possible; only ask the user as a last resort.
    - For optional parameters: if the user doesn't provide a value, use the schema's default if one exists; otherwise omit the parameter.
    - Never fabricate or guess parameter values.`,
  tools: agentTools,
});
