import { defineComponentMap } from '@uai/client';
import { Shipments } from './shipments';
import { SignOut } from './sign-out';

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
  signOut: component({
    description: 'Sign out',
    component: SignOut,
  }),
}));
