import { defineComponentMap } from '@uai/client';
import { shipments } from './shipments';
import { signOut } from './sign-out';
import { changeLanguage } from './change-language';

export const componentMap = defineComponentMap({
  shipments,
  signOut,
  changeLanguage,
});
