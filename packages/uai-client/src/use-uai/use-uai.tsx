import { useChat, UIMessage as UIMessageAiSdk } from '@ai-sdk/react';
import type { UAIMessage } from '../ui-message';
import {
  ChatOnErrorCallback,
  ChatOnFinishCallback,
  ChatStatus,
  DefaultChatTransport,
} from 'ai';
import { type ComponentMap } from '../component-map/component-map';
import { convertComponentMapForServer } from './component-map-for-server.conversion';
import {
  convertAiSdkMessagesToUAIMessages,
  convertUAIMessagesToAiSdkMessages,
} from './ui-message.conversion';
import { AiSdkMessage } from './ai-sdk-message.format';
import { useCallback } from 'react';

type useUaiOptions<COMPONENT_MAP extends ComponentMap> = {
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
  componentMap: COMPONENT_MAP;

  /**
   * Initial messages to be sent to the UAI Server API.
   */
  initialMessages?: UAIMessage<COMPONENT_MAP>[];

  /**
   * Callback function to be called when an error is encountered.
   */
  onError?: ChatOnErrorCallback;

  /**
   * Callback function to be called when the chat is finished.
   */
  onFinish?: ChatOnFinishCallback<UIMessageAiSdk>;
};

export const useUai = <COMPONENT_MAP extends ComponentMap>(
  options: useUaiOptions<COMPONENT_MAP>
): {
  id: string;
  messages: UAIMessage<COMPONENT_MAP>[];
  error: Error | undefined;
  sendMessage: (text: string) => Promise<void>;
  status: ChatStatus;
} => {
  // Define the UAI-specific useChat hook from the Vercel AI SDK
  const {
    id,
    messages,
    error,
    sendMessage: sendAiSdkMessage,
    status,
  } = useChat<AiSdkMessage>({
    ...(options.id ? { id: options.id } : {}),
    transport: new DefaultChatTransport({
      api: options.uaiServerUrl,
      prepareSendMessagesRequest: async ({ messages, id }) => ({
        body: {
          messages,
          id,
          // Send the component map to the UAI server
          componentMap: await convertComponentMapForServer(
            options.componentMap
          ),
        },
      }),
    }),
    messages: convertUAIMessagesToAiSdkMessages(options.initialMessages),
    onError: options.onError,
    onFinish: options.onFinish,
  });

  const sendMessage = useCallback(
    (text: string) =>
      sendAiSdkMessage({
        text,
        metadata: { timestamp: new Date().toISOString() },
      }),
    [sendAiSdkMessage]
  );

  return {
    id,
    messages: convertAiSdkMessagesToUAIMessages(messages, options.componentMap),
    error,
    sendMessage,
    status,
  };
};
