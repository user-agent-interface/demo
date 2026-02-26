import { component, schema } from '@uai/client';

export const updateShipment = component({
  description: 'Update details of a shipment',
  inputSchema: schema.object({
    shipmentId: schema.string(),
  }),
  component: function UpdateShipment({ shipmentId }: { shipmentId: string }) {
    return <div>Update Shipment {shipmentId}</div>;
  },
});
