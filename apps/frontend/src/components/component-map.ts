import { defineComponentMap } from '@uai/client';
import { shipments } from './shipments';
import { signOut } from './sign-out';

export const componentMap = defineComponentMap({
  shipments,
  signOut,
});
