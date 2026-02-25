import { useEffect, useRef } from 'react';
import { UAIMessage } from '@uai/client';
import { componentMap } from '../../components/uai/component-map';
import { TextMessageBubble } from './text-message-bubble';
import { RenderComponent } from './render-component';
import { TypingIndicator } from './typing-indicator';

export function ChatMessages({
  messages,
  agentAnswerInProgress,
}: {
  messages: UAIMessage<typeof componentMap>[];
  agentAnswerInProgress: boolean;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change or when agent is typing
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, agentAnswerInProgress]);

  return (
    <div ref={scrollContainerRef} className="h-full overflow-y-auto px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {messages.map((message) => {
          if (message.type === 'text')
            // Text message
            return <TextMessageBubble key={message.id} message={message} />;

          if (message.type === 'render-component') {
            // Render component message
            return <RenderComponent key={message.id} message={message} />;
          }

          return null;
        })}

        {agentAnswerInProgress && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
