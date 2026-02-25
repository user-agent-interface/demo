import { useCallback } from 'react';
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
    text: 'Greetings, Operator!\nHow may I be of service today?',
  },
]);

export function App() {
  const { messages, sendMessage, status } = useUai({
    uaiServerUrl,
    componentMap,
    initialMessages,
  });

  const agentAnswerInProgress =
    // either if we just submitted the message
    status === 'submitted' ||
    // or if we are streaming and the last message is still empty (waiting for streamed parts to be ready)
    (status === 'streaming' && messages[messages.length - 1].type === 'empty');

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
            agentAnswerInProgress={agentAnswerInProgress}
          />
        </div>
      </div>
    </main>
  );
}
