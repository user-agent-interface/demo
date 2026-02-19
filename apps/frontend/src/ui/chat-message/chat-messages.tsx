import { UAIMessage } from '@uai/client';
import { componentMap } from '../../components/component-map';
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
  return (
    <div className="h-full overflow-y-auto px-4 py-6">
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
      </div>
    </div>
  );
}
