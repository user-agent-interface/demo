import { UAIMessage } from '@uai/client';
import { componentMap } from '../../components/component-map';
import { Shipments } from '../../components/shipments';
import { SignOut } from '../../components/sign-out';

export function RenderComponent({
  message,
}: {
  message: UAIMessage<typeof componentMap>;
}) {
  const render = message.parts.find((part) => part.type === 'render-component');
  if (!render) return null;

  if (render.state === 'input-available') {
    return (
      <>
        {render.componentId === 'shipments' && (
          <Shipments {...render.inputValues} />
        )}
        {render.componentId === 'signOut' && (
          <SignOut {...render.inputValues} />
        )}
      </>
    );
  }
  return null;
}
