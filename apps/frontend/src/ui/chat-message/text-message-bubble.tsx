import { UAIMessage } from '@uai/client';
import { componentMap } from '../../components/component-map';
import { cn } from '../../utils/cn';
import { Bot, User } from 'lucide-react';

export function TextMessageBubble({
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

function formatTime(date?: string) {
  return date
    ? new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : null;
}
