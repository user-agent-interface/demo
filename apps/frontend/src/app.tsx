import { useCallback } from 'react';
import { ChatMessages } from './components/chat-messages';
import { ChatHeader } from './components/header';
import { ChatInput } from './components/chat-input';
import { UIMessage } from './components/ui-message';
import { useUai } from '@uai/client';

const uaiServerUrl = `${import.meta.env.VITE_UAI_SERVER_HOST_URL}/api/uai-server`;

const initialMessages: UIMessage[] = [
  {
    metadata: { timestamp: new Date().toISOString() },
    id: 'initial',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: 'Greetings, Operator!\nI am your advanced agent, ready to assist with any query or task you require.\n\nHow may I be of service today?',
      },
    ],
  },
];

export function App() {
  const { messages, sendMessage, status } = useUai<UIMessage>({
    uaiServerUrl,
    initialMessages,
  });

  const isTyping = status === 'submitted'; // waiting for stream to start

  const handleSendMessage = useCallback(
    async (text: string) => {
      await sendMessage({
        parts: [{ type: 'text', text }],
        metadata: { timestamp: new Date().toISOString() },
      });
    },
    [sendMessage]
  );

  return (
    <main className="min-h-dvh bg-background relative">
      {/* Grid background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
        linear-gradient(to right, currentColor 1px, transparent 1px),
        linear-gradient(to bottom, currentColor 1px, transparent 1px)
      `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Glow orbs */}
      <div className="pointer-events-none fixed top-1/4 -left-32 h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
      <div className="pointer-events-none fixed bottom-1/4 -right-32 h-64 w-64 rounded-full bg-accent/20 blur-[100px]" />

      {/* Chat Interface */}
      <div className="relative flex h-screen flex-col lg:flex-row">
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <ChatHeader />

          {/* Chat Messages */}
          <div className="flex-1 overflow-hidden">
            <ChatMessages messages={messages} isTyping={isTyping} />
          </div>

          {/* Chat Input */}
          <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />
        </div>
      </div>
    </main>
  );
}
