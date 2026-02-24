import { defineComponentMap } from '@uai/client';
import { shipments } from './uai/shipments';
import { signOut } from './uai/sign-out';
import { changeLanguage } from './uai/change-language';

export const componentMap = defineComponentMap({
  shipments,
  signOut,
  changeLanguage,
});
