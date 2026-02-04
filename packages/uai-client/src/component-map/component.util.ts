import type { JSONValue } from 'ai';
import { ZodType } from 'zod';

type JSONObject = {
  [key: string]: JSONValue | undefined;
};

export type ComponentAsTool<
  INPUT extends JSONObject | undefined = undefined,
  OUTPUT extends JSONObject | undefined = undefined,
> = {
  // USED BY UAI-SERVER

  /**
   * An optional title of the tool.
   */
  title?: string;

  /**
   * An optional description of what the tool does.
   * Will be used by the language model to decide whether to use the tool.
   * Not used for provider-defined tools.
   */
  description?: string;

  /**
   * The schema of the input that the tool expects.
   * The language model will use this to validate the input.
   *
   * You can use descriptions on the schema properties to make the input understandable for the language model.
   */
  inputSchema: ZodType<INPUT>;

  /**
   * An optional list of input examples that show the language
   * model what the input should look like.
   */
  inputExamples?: INPUT[];

  /**
   * The schema of the output that the tool returns.
   * The language model will use this to validate the output of the language model.
   *
   * You can use descriptions on the schema properties to make the output understandable for the language model.
   */
  outputSchema?: ZodType<OUTPUT>;

  // USED BY UAI-CLIENT

  /**
   * The React component to be used as the tool.
   */
  component: React.ComponentType<INPUT>;
};

export const component = <
  INPUT extends JSONObject | undefined = undefined,
  OUTPUT extends JSONObject | undefined = undefined,
>(
  component: ComponentAsTool<INPUT, OUTPUT>
): ComponentAsTool<INPUT, OUTPUT> => component;
