import { JSONValue, tool, Tool } from 'ai';
import { ZodType } from 'zod';

type JSONObject = {
  [key: string]: JSONValue | undefined;
};

export type ComponentAsTool<
  INPUT extends JSONObject | undefined = undefined,
  OUTPUT extends JSONObject | undefined = undefined,
> = {
  // used by uai-server
  tool: Tool<INPUT, OUTPUT>;
  // used by uai-client
  component: React.ComponentType<INPUT>
};

export const component = <
  INPUT extends JSONObject | undefined = undefined,
  OUTPUT extends JSONObject | undefined = undefined,
>(
  component:
    {
      title?: string;
      description?: string;
      inputSchema?: ZodType<INPUT>;
      inputExamples?: INPUT[];
      outputSchema?: ZodType<OUTPUT>;
    } & { component: React.ComponentType<INPUT> }
): ComponentAsTool<INPUT, OUTPUT> => {
  return {
    tool: tool({
      // tool properties
      title: component.title,
      description: component.description,
      inputSchema: component.inputSchema,
      inputExamples: component.inputExamples,
      outputSchema: component.outputSchema,

      // default tool properties for component
      strict: true,
      supportsDeferredResults: true,
    } as Tool<INPUT, OUTPUT>),
    component: component.component,
  };
};

export type Component = typeof component;
