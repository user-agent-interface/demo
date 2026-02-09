import { UIMessage, useChat, UseChatHelpers } from '@ai-sdk/react';
import {
  asSchema,
  ChatOnErrorCallback,
  ChatOnFinishCallback,
  DefaultChatTransport,
} from 'ai';
import type { ComponentMapForServer } from '@uai/shared';
import { type ComponentMap } from './component-map/component-map';

type useUaiOptions<UI_MESSAGE extends UIMessage = UIMessage> = {
  /**
   * A unique identifier for the chat. If not provided, a random one will be
   * generated.
   */
  id?: string;

  /**
   * The UAI Server API URL to be used for the UAI chat transport.
   */
  uaiServerUrl: string;

  /**
   * The component map to be used for the UAI chat.
   */
  componentMap: ComponentMap;

  /**
   * Initial messages to be sent to the UAI Server API.
   */
  initialMessages?: UI_MESSAGE[];

  /**
   * Callback function to be called when an error is encountered.
   */
  onError?: ChatOnErrorCallback;

  /**
   * Callback function to be called when the chat is finished.
   */
  onFinish?: ChatOnFinishCallback<UI_MESSAGE>;
};

export const useUai = <UI_MESSAGE extends UIMessage = UIMessage>(
  options: useUaiOptions<UI_MESSAGE>
): {
  id: UseChatHelpers<UI_MESSAGE>['id'];
  messages: UseChatHelpers<UI_MESSAGE>['messages'];
  error: UseChatHelpers<UI_MESSAGE>['error'];
  sendMessage: UseChatHelpers<UI_MESSAGE>['sendMessage'];
  status: UseChatHelpers<UI_MESSAGE>['status'];
} => {
  // Define the UAI-specific useChat hook from the Vercel AI SDK
  const { id, messages, error, sendMessage, status } = useChat<UI_MESSAGE>({
    ...(options.id ? { id: options.id } : {}),
    transport: new DefaultChatTransport({
      api: options.uaiServerUrl,
      prepareSendMessagesRequest: async ({ messages, id }) => {
        const componentMapForServer: ComponentMapForServer = {};

        // remove the only client-side objects (e.g. React components)
        // convert the tool definition to an interpretable format for the UAI server (e.g. JSON schemas)
        Object.entries(options.componentMap).forEach(
          async ([componentKey, component]) => {
            componentMapForServer[componentKey] = {
              title: component.title,
              description: component.description,
              inputExamples: component.inputExamples,
              inputSchema: await asSchema(component.inputSchema).jsonSchema,
              outputSchema: component.outputSchema
                ? await asSchema(component.outputSchema).jsonSchema
                : undefined,
            };
          }
        );

        return {
          body: {
            messages,
            id,
            // Send the component map to the UAI server
            componentMap: componentMapForServer,
          },
        };
      },
    }),
    messages: options.initialMessages,
    onError: options.onError,
    onFinish: options.onFinish,
  });

  return {
    id,
    messages: messages.map((message) => ({
      ...message,
      parts: message.parts.map((part) => {
        if ('toolCallId' in part) {
          // some tool from the component map was called

          // remove the "tool-" prefix from the tool call type (format: `tool-${toolId}`) to get the component key
          const componentId = part.type.replace(/^tool-/, '');
          // get the component from the component map
          const component = options.componentMap[componentId];
          if (!component) {
            console.error(
              `tool '${componentId}' not found in component map`,
              `component map keys: ${Object.keys(options.componentMap).join(', ')}`
            );
            return part;
          }

          return {
            type: 'render-component',
            state: part.state,
            ...component,
            inputValues: part.input,
          };
        }

        // no tool call, return the part as is
        return part;
      }),
    })),
    error,
    sendMessage,
    status,
  };
};
