import { UIMessage, useChat, UseChatHelpers } from '@ai-sdk/react';
import {
  ChatOnErrorCallback,
  ChatOnFinishCallback,
  DefaultChatTransport,
} from 'ai';

type useUaiOptions<UI_MESSAGE extends UIMessage = UIMessage> = {
  /**
   * A unique identifier for the chat. If not provided, a random one will be
   * generated.
   */
  id?: string;

  /**
   * The UAI Server API URL to be used for the chat transport.
   */
  uaiServerUrl: string;

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
  const { id, messages, error, sendMessage, status } = useChat<UI_MESSAGE>({
    ...(options.id ? { id: options.id } : {}),
    transport: new DefaultChatTransport({ api: options.uaiServerUrl }),
    messages: options.initialMessages,
    onError: options.onError,
    onFinish: options.onFinish,
  });

  console.log('in', messages);

  return {
    id,
    messages,
    error,
    sendMessage,
    status,
  };
};
