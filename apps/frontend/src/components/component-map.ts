import { defineComponentMap } from '@uai/client';
import { Shipments } from './shipments';

export const componentMap = defineComponentMap((component, schema) => ({
  shipments: component({
    description: 'Show shipments',
    inputSchema: schema.object({
      displayType: schema.enum(['map', 'list']).default('map'),
      filter: schema
        .enum(['inTransit', 'delayed', 'delivered'])
        .default('inTransit'),
    }),
    component: Shipments,
  }),
}));
