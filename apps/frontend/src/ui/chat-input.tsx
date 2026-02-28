'use client';

import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/ui/button';
import { cn } from '@/utils/cn';

export function ChatInput({
  onSendMessage,
  disabled,
}: {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const suggestions = [
    'Show the delayed shipments',
    'Update a shipment',
    'Sign out',
    // in german: Change the language to German
    'Sprache auf Deutsch ändern',
  ];

  return (
    <div className="border-t border-border/50 bg-card/50 backdrop-blur-sm p-4 pb-2">
      <div className="mx-auto max-w-3xl">
        {/* Quick Suggestions */}
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="flex items-center gap-1.5 rounded-full border border-border/50 bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-foreground"
            >
              <Sparkles className="h-3 w-3" />
              {suggestion}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div
          className={cn(
            'relative flex items-end gap-2 rounded-2xl border bg-input/50 p-2 transition-all duration-200',
            isFocused
              ? 'border-primary/50 shadow-[0_0_20px_rgba(0,255,200,0.1)]'
              : 'border-border/50'
          )}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter your query..."
            className="max-h-[120px] min-h-[40px] flex-1 resize-none bg-transparent py-2 pl-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            rows={1}
            disabled={disabled}
          />

          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || disabled}
            size="icon"
            className={cn(
              'h-9 w-9 shrink-0 rounded-xl transition-all',
              input.trim() && !disabled
                ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,255,200,0.3)]'
                : 'bg-secondary text-muted-foreground'
            )}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>

        {/* Footer Info */}
        <p className="mt-2 text-center font-mono text-[10px] text-muted-foreground">
          <span className="tracking-wider">user agent interface - demo by</span>{' '}
          <a
            href="https://futuristic.digital"
            target="_blank"
            className="font-montserrat font-bold text-accent"
          >
            futuristic
          </a>
        </p>
      </div>
    </div>
  );
}
