import { TextUIPart } from 'ai';

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
) =>
  messages.map((message) => {
    const textPart: TextUIPart = { type: 'text', text: message.text };

    return {
      id: message.id,
      role: message.role,
      timestamp: new Date().toISOString(),
      type: 'text',
      text: textPart,
      parts: [textPart],
    };
  });
