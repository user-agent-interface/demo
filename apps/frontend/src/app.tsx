import { ChatHeader } from "./components/header";

export function App() {
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
        </div>
      </div>
    </main>
  );
}
