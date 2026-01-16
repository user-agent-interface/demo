import { useCallback, useState } from "react";
import { ChatMessages } from "./components/chat-messages";
import { ChatHeader } from "./components/header";
import { Message } from "./components/message";
import { ChatInput } from "./components/chat-input";

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "NEURAL INTERFACE INITIALIZED\n\nGreetings, Operator. I am NEXUS-7, your advanced AI companion. My neural networks are fully operational and ready to assist with any query or task you require.\n\nHow may I be of service today?",
    timestamp: new Date(Date.now() - 60000),
  },
];

export function App() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = useCallback(async (content: string) => {
    console.log("Sending message:", content);
  }, []);

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Grid background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
        linear-gradient(to right, currentColor 1px, transparent 1px),
        linear-gradient(to bottom, currentColor 1px, transparent 1px)
      `,
          backgroundSize: "50px 50px",
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
