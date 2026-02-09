import { UAIMessage } from '../ui-message';
import { ComponentMap } from '../component-map/component-map';
import { ToolUIPart } from 'ai';
import { AiSdkMessage } from './ai-sdk-message.format';
import { ComponentInputOf } from '../component-map/component.util';

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
        .map((part) => {
          if ('toolCallId' in part) {
            // some tool from the component map was called

            // remove the "tool-" prefix from the tool call type (format: `tool-${toolId}`) to get the component key
            const componentId = part.type.replace(/^tool-/, '');
            // get the component from the component map
            const component = componentMap[componentId];
            if (!component) {
              console.error(
                `tool '${componentId}' not found in component map`,
                `component map keys: ${Object.keys(componentMap).join(', ')}`
              );
            }

            return {
              type: 'render-component',
              componentId,
              state: part.state,
              inputValues: part.input as ComponentInputOf<typeof part>,
              ...component,
              _toolCall: part,
            };
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
            type: `tool-${part.componentId}`,
            input: part.inputValues,
            ...part._toolCall,
          } as ToolUIPart;
        }

        return part;
      }),
    };
  });
