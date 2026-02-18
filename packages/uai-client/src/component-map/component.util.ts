import { ZodType, z } from 'zod';

type BaseReactComponentProps = {
  componentState: 'input-available' | 'input-streaming' | 'output-available';
};

export type ComponentAsTool<
  INPUT extends object,
  OUTPUT extends object | undefined = undefined,
> = {
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

  /**
   * The React component to be used as the tool.
   */
  component: React.ComponentType<
    OUTPUT extends undefined
      ? INPUT & BaseReactComponentProps
      : INPUT &
          BaseReactComponentProps & {
            // WATCH OUT: omit below params from IsEmptyObject check in ComponentDefinition
            setComponentOutput: (output: OUTPUT | 'cancelled') => Promise<void>;
            componentOutput?: OUTPUT | 'cancelled';
          }
  >;
};

export type ComponentDefinition<
  INPUT extends object,
  OUTPUT extends object | undefined = undefined,
> = (IsEmptyObject<Omit<INPUT, 'setComponentOutput' | 'output'>> extends true
  ? Omit<ComponentAsTool<INPUT, OUTPUT>, 'inputSchema'> & {
      // allow undefined INPUT, we default to a matching empty-schema
      inputSchema?: ZodType<INPUT>;
    }
  : ComponentAsTool<INPUT, OUTPUT>) & {
  // FOR TYPE CHECKING ONLY
};

export const component = <
  INPUT extends object,
  OUTPUT extends object | undefined = undefined,
>(
  component: ComponentDefinition<INPUT, OUTPUT>
): ComponentAsTool<INPUT, OUTPUT> =>
  ({
    ...component,
    inputSchema:
      component.inputSchema ??
      // when INPUT is an empty object, we default to a matching empty-schema
      z.object({} as INPUT),
  }) as ComponentAsTool<INPUT, OUTPUT>;

// Type Utilities
export type ComponentInputOf<T> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends ComponentAsTool<infer INPUT, any> ? INPUT : never;

type IsEmptyObject<T extends object> = keyof T extends never ? true : false;
