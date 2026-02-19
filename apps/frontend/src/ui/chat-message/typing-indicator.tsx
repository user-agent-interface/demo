import { Bot } from 'lucide-react';

export function TypingIndicator() {
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
