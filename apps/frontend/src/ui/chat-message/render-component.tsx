import { UAIRenderComponentMessage } from '@uai/client';
import { componentMap } from '../../components/component-map';
import { Shipments } from '../../components/shipments';
import { SignOut } from '../../components/sign-out';

export function RenderComponent({
  message: {
    renderComponent: { componentId, inputValues, state },
  },
}: {
  message: UAIRenderComponentMessage<typeof componentMap>;
}) {
  if (state === 'input-available' || state === 'output-available') {
    return (
      <>
        {componentId === 'shipments' && <Shipments {...inputValues} />}
        {componentId === 'signOut' && <SignOut {...inputValues} />}
      </>
    );
  }
  return null;
}
