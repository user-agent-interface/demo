import { component, schema } from '@uai/client';
import { Shipment } from '@uai/shared';
import { DeepPartial } from 'ai';

export const updateShipment = component({
  description: 'Update details of a shipment',
  inputSchema: schema.object({
    shipmentId: schema.string(),
  }),
  component: function UpdateShipment({
    shipmentId: _shipmentId,
    preferredUpdate: _preferredUpdate,
  }: {
    shipmentId?: string;
    preferredUpdate?: DeepPartial<Shipment>;
  }) {
    return <div>Update Shipment</div>;
  },
});
