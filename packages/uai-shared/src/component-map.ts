import { JSONSchema7 } from 'ai';

/**
 * Server-side representation of a component map for the AI SDK tools.
 * Used when sending the component map to the UAI server (e.g. in API request body).
 */
export type ComponentMapForServer = Record<
  string,
  {
    title?: string;
    description?: string;
    inputSchema: JSONSchema7;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inputExamples?: any[];
    outputSchema?: JSONSchema7;
  }
>;

export type UIMessageMetadata = { timestamp: string };
