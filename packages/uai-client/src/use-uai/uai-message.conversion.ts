import type { ComponentRenderUIPart, UAIMessage } from './uai-message';
import type { ComponentMap } from '../component-map/component-map';
import type { ToolUIPart, UIToolInvocation } from 'ai';
import type { AiSdkMessage } from './ai-sdk-message.format';
import type { ComponentInputOf } from '../component-map/component.util';

const isComponentId = <COMPONENT_MAP extends ComponentMap>(
  componentMap: COMPONENT_MAP,
  componentId: string
): componentId is Extract<keyof COMPONENT_MAP, string> =>
  componentId in componentMap;

const toComponentRenderPart = <
  COMPONENT_MAP extends ComponentMap,
  K extends Extract<keyof COMPONENT_MAP, string>,
>(
  componentMap: COMPONENT_MAP,
  componentId: K,
  part: ToolUIPart
): ComponentRenderUIPart<COMPONENT_MAP, K> => {
  const component = componentMap[componentId];
  const toolCall = part as UIToolInvocation<COMPONENT_MAP[K]>;
  const { input: _input, ...toolCallWithoutInput } = toolCall;

  return {
    type: 'render-component',
    componentId,
    state: toolCall.state,
    inputValues: toolCall.input as ComponentInputOf<COMPONENT_MAP[K]>,
    ...component,
    _toolCall: toolCallWithoutInput,
  } as ComponentRenderUIPart<COMPONENT_MAP, K>;
};

export const convertAiSdkMessagesToUAIMessages = <
  COMPONENT_MAP extends ComponentMap,
>(
  aiSdkMessages: Array<AiSdkMessage>,
  componentMap: COMPONENT_MAP
): Array<UAIMessage<COMPONENT_MAP>> =>
  aiSdkMessages.map((message) => {
    const timestamp = message.metadata?.timestamp;
    if (!timestamp) console.error('timestamp is missing in message.', message);

    return {
      id: message.id,
      role: message.role,
      timestamp: message.metadata?.timestamp ?? '',
      parts: message.parts
        .filter(
          (part) =>
            // filter out parts that are not relevant to the UAI client
            part.type !== 'file' &&
            part.type !== 'source-url' &&
            part.type !== 'source-document' &&
            part.type !== 'dynamic-tool'
        )
        .flatMap((part) => {
          if ('toolCallId' in part) {
            // some tool from the component map was called

            // remove the "tool-" prefix from the tool call type (format: `tool-${toolId}`) to get the component key
            const componentId = part.type.replace(/^tool-/, '');
            if (!isComponentId(componentMap, componentId)) {
              console.error(
                `tool '${componentId}' not found in component map`,
                `component map keys: ${Object.keys(componentMap).join(', ')}`
              );
              return [];
            }

            return toComponentRenderPart(componentMap, componentId, part);
          }

          // no tool call, return the (not already filtered out) part as is
          return part as Exclude<typeof part, { type: `data-${string}` }>;
        }),
    };
  });

export const convertUAIMessagesToAiSdkMessages = <
  COMPONENT_MAP extends ComponentMap,
>(
  uaiMessages?: Array<UAIMessage<COMPONENT_MAP>>
): Array<AiSdkMessage> | undefined =>
  uaiMessages?.map((message) => {
    return {
      id: message.id,
      role: message.role,
      metadata: { timestamp: message.timestamp },
      parts: message.parts.map((part) => {
        if (part.type === 'render-component') {
          return {
            type: `tool-${String(part.componentId)}`,
            input: part.inputValues,
            ...part._toolCall,
          } as ToolUIPart;
        }

        return part;
      }),
    };
  });
