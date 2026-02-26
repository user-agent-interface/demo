import { component, schema } from '@uai/client';
import { Shipments } from '../shipments';

export const shipments = component({
  description: 'Show shipments',
  inputSchema: schema.object({
    displayType: schema.enum(['map', 'list']).default('map'),
    filter: schema
      .enum(['inTransit', 'delayed', 'delivered'])
      .default('inTransit'),
  }),
  component: function ShowShipments({
    displayType,
    filter,
  }: {
    displayType: 'map' | 'list';
    filter: 'inTransit' | 'delayed' | 'delivered';
  }) {
    return <Shipments displayType={displayType} filter={filter} />;
  },
});
