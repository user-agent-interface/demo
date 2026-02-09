import { cn } from '@/utils/cn';
import { UAIMessage } from '@uai/client';
import { Bot, User } from 'lucide-react';
import { componentMap } from '../components/component-map';

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
          if (message.parts.some((part) => part.type === 'text'))
            // Text message
            return <MessageBubble key={message.id} message={message} />;

          if (message.parts.some((part) => part.type === 'render-component')) {
            // Render component message
            const render = message.parts.find(
              (part) => part.type === 'render-component'
            )!;

            if (render.state === 'input-available') {
              const Component = render.component;
              return <Component key={message.id} {...render.inputValues} />;
            }
            return null;
          }

          // Still waiting for the text parts
          return <TypingIndicator key={message.id} />;
        })}

        {agentAnswerInProgress && <TypingIndicator />}
      </div>
    </div>
  );
}

function MessageBubble({
  message,
}: {
  message: UAIMessage<typeof componentMap>;
}) {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={cn(
        'flex gap-3',
        isAssistant ? 'justify-start' : 'justify-end'
      )}
    >
      {isAssistant && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}

      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          isAssistant
            ? 'bg-card border border-border/50 rounded-tl-sm'
            : 'bg-primary text-primary-foreground rounded-tr-sm'
        )}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.parts
            .map((part) => (part.type === 'text' ? part.text : null))
            .join('')}
        </p>
        <p
          className={cn(
            'mt-2 text-[10px] font-mono',
            isAssistant ? 'text-muted-foreground' : 'text-primary-foreground/70'
          )}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>

      {!isAssistant && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary border border-border/50">
          <User className="h-4 w-4 text-foreground" />
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
        <Bot className="h-4 w-4 text-primary" />
      </div>
      <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-card border border-border/50 px-4 py-3">
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

function formatTime(date?: string) {
  return date
    ? new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : null;
}
