import { useCallback, useMemo } from 'react';
import { ChatMessages } from './ui/chat-message/chat-messages';
import { ChatHeader } from './ui/header';
import { ChatInput } from './ui/chat-input';
import { useUai, defineInitialMessages } from '@uai/client';
import { componentMap } from './components/uai/component-map';

const uaiServerUrl = `${import.meta.env.VITE_UAI_SERVER_HOST_URL}/api/uai-server`;

const initialMessages = defineInitialMessages([
  {
    id: 'initial',
    role: 'assistant',
    text: "Welcome! This is a User Agent Interface demo — a different way to use apps.\n\nInstead of hunting for buttons and menus, you simply type what you want to do in your own words, like in a chat. I'll understand your request and help you get it done.\n\nThis demo is a simple logistics management app: you can ask to see your shipments, pick one to view or update its details, change the language of the interface, or sign out. You can type your request in the box below, or use the suggestions above it to get started quickly.",
  },
]);

export function App() {
  const { messages, sendMessage, status } = useUai({
    uaiServerUrl,
    componentMap,
    initialMessages,
  });

  const agentAnswerInProgress =
    status === 'streaming' || status === 'submitted';

  const waitingForComponentOutput = useMemo(() => {
    const lastMessage = messages[messages.length - 1];
    return lastMessage.parts.some(
      (part) =>
        part.type === 'render-component' && part.state !== 'output-available'
    );
  }, [messages]);

  const handleSendMessage = useCallback(
    async (text: string) => await sendMessage(text),
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
            <ChatMessages
              messages={messages}
              agentAnswerInProgress={agentAnswerInProgress}
            />
          </div>

          {/* Chat Input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={agentAnswerInProgress || waitingForComponentOutput}
          />
        </div>
      </div>
    </main>
  );
}
