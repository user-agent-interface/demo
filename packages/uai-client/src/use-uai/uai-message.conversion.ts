import type { ComponentRenderUIPart, UAIMessage } from './uai-message';
import type { ComponentMap } from '../component-map/component-map';
import type { ToolUIPart, UIToolInvocation } from 'ai';
import type { AiSdkMessage } from './ai-sdk-message.format';
import type {
  ComponentInputOf,
  ComponenToolState,
} from '../component-map/component.util';
import { UseChatHelpers } from '@ai-sdk/react';
import { z } from 'zod';

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
  part: ToolUIPart,
  addToolOutput: UseChatHelpers<AiSdkMessage>['addToolOutput']
): ComponentRenderUIPart<COMPONENT_MAP, K> => {
  const component = componentMap[componentId];
  const toolCall = part as UIToolInvocation<COMPONENT_MAP[K]> & {
    state: ComponenToolState;
  };
  const { input: _input, ...toolCallWithoutInput } = toolCall;

  return {
    type: 'render-component',
    componentId,
    state: toolCall.state,
    componentProps: {
      ...(toolCall.input as ComponentInputOf<COMPONENT_MAP[K]>),
      componentState: toolCall.state,
      componentOutput: toolCall.output,
      setComponentOutput: component.outputSchema
        ? (output: z.infer<typeof component.outputSchema> | 'cancelled') =>
            addToolOutput({
              tool: componentId,
              toolCallId: toolCall.toolCallId,
              state: 'output-available',
              output,
            })
        : undefined,
    },
    ...component,
    _toolCall: toolCallWithoutInput,
  } as ComponentRenderUIPart<COMPONENT_MAP, K>;
};

export const convertAiSdkMessagesToUAIMessages = <
  COMPONENT_MAP extends ComponentMap,
>(
  aiSdkMessages: Array<AiSdkMessage>,
  componentMap: COMPONENT_MAP,
  addToolOutput: UseChatHelpers<AiSdkMessage>['addToolOutput']
): Array<UAIMessage<COMPONENT_MAP>> =>
  aiSdkMessages.flatMap((message) => {
    const { id, role, metadata, parts: originalParts } = message;
    // Timestamp
    const timestamp = metadata?.timestamp ?? '';
    if (!timestamp) console.error('timestamp is missing in message.', message);

    const parts = originalParts
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
          // Convert tool call to component render part

          // remove the "tool-" prefix from the tool call type (format: `tool-${toolId}`) to get the component key
          const componentId = part.type.replace(/^tool-/, '');
          if (!isComponentId(componentMap, componentId)) {
            console.error(
              `tool '${componentId}' not found in component map`,
              `component map keys: ${Object.keys(componentMap).join(', ')}`
            );
            return [];
          }

          return toComponentRenderPart(
            componentMap,
            componentId,
            part,
            addToolOutput
          );
        }

        // no tool call, return the (not already filtered out) part as is
        return part as Exclude<typeof part, { type: `data-${string}` }>;
      });

    return { id, role, timestamp, parts };
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
            input: part.componentProps,
            ...part._toolCall,
          } as ToolUIPart;
        }

        return part;
      }),
    };
  });
