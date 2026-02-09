import { UAIMessage } from '../ui-message';

export const defineInitialMessages = (
  messages: Array<{
    /**
     * A unique identifier for the message.
     */
    id: string;
    /**
     * The role of the message.
     */
    role: 'system' | 'user' | 'assistant';
    /**
     * The text content.
     */
    text: string;
  }>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Array<UAIMessage<any>> =>
  messages.map((message) => ({
    id: message.id,
    role: message.role,
    timestamp: new Date().toISOString(),
    parts: [{ type: 'text', text: message.text }],
  }));
