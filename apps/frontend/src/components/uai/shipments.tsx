import { component, schema } from '@uai/client';
import { Shipments } from '../shipments';
import { Shipment } from '@uai/shared';
import { useCallback } from 'react';

const shipmentSchema = schema.object({
  displayType: schema.enum(['map', 'list']).default('map'),
  filter: schema
    .enum(['inTransit', 'delayed', 'delivered'])
    .default('inTransit'),
});

export const showShipments = component({
  description: 'Show shipments',
  inputSchema: shipmentSchema,
  component: function ShowShipments({ displayType, filter }) {
    return <Shipments displayType={displayType} filter={filter} />;
  },
});

export const selectShipment = component({
  description: 'Select a shipment',
  inputSchema: shipmentSchema,
  outputSchema: schema.object({
    selectedShipmentId: schema.string(),
  }),
  component: function ShowShipments({
    displayType,
    filter,
    setComponentOutput,
  }) {
    const handleSelectShipment = useCallback(
      (shipment: Shipment) => {
        setComponentOutput({
          selectedShipmentId: shipment.id,
        });
      },
      [setComponentOutput]
    );
    return (
      <Shipments
        displayType={displayType}
        filter={filter}
        onSelect={handleSelectShipment}
      />
    );
  },
});
