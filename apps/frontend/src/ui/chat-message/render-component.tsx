import { ComponentRenderUIPart } from '@uai/client';
import { componentMap } from '../../components/uai/component-map';
import { formatChatMessageTimestamp } from './chat-message-timestamp';
import { useLogOnce } from '../../utils/use-log-once.hook';

export function RenderComponent({
  timestamp,
  renderComponentPart: { componentId, state, componentProps },
}: {
  timestamp: string;
  renderComponentPart: ComponentRenderUIPart<typeof componentMap>;
}) {
  const logComponentRendered = useLogOnce(componentId, 'Component rendered.');

  if (state === 'input-available' || state === 'output-available') {
    const Component = componentMap[componentId].component;

    logComponentRendered(componentId, componentProps);
    return (
      <div>
        <div>
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
  }

  return null;
}
