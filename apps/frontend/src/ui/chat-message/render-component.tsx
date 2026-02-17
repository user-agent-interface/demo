import { UAIRenderComponentMessage } from '@uai/client';
import { componentMap } from '../../components/component-map';

export function RenderComponent({
  message: {
    renderComponent: { componentId, componentProps, state },
  },
}: {
  message: UAIRenderComponentMessage<typeof componentMap>;
}) {
  if (state === 'input-available' || state === 'output-available') {
    const Component = componentMap[componentId].component;
    return (
      <>
        {/* Component's Type is the Union of all possible components from componentMap,
        while componentProps Type is the Union of all possible componentProps from componentMap.
        @ts-expect-error - TypeScript cannot infer the match between the two types */}
        <Component {...componentProps} />
      </>
    );
  }
  return null;
}
