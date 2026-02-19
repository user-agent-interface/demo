import { UAIRenderComponentMessage } from '@uai/client';
import { componentMap } from '../../components/component-map';
import { formatChatMessageTimestamp } from './chat-message-timestamp';
import { TypingIndicator } from './typing-indicator';

export function RenderComponent({
  message: {
    renderComponent: { componentId, componentProps, state },
    timestamp,
  },
}: {
  message: UAIRenderComponentMessage<typeof componentMap>;
}) {
  if (state === 'input-available' || state === 'output-available') {
    const Component = componentMap[componentId].component;
    return (
      <div>
        <div className="rounded-xl border border-border/50 bg-card/50 p-4">
          {/* Component's Type is the Union of all possible components from componentMap,
        while componentProps Type is the Union of all possible componentProps from componentMap.
        @ts-expect-error - TypeScript cannot infer the match between the two types */}
          <Component {...componentProps} />
        </div>
        <p className="mt-2 ml-5 text-[10px] font-mono text-muted-foreground">
          {formatChatMessageTimestamp(timestamp)}
        </p>
      </div>
    );
  } else if (state === 'input-streaming') {
    // IN FUTURE: Some component may have an input-streaming state, while the component can be partially rendered
    return <TypingIndicator />;
  }

  return null;
}
