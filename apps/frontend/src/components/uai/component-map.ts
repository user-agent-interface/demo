import { defineComponentMap } from '@uai/client';
import { shipments } from './shipments';
import { signOut } from './sign-out';
import { changeLanguage } from './change-language';
import { updateShipment } from './update-shipment';

export const componentMap = defineComponentMap({
  shipments,
  updateShipment,
  signOut,
  changeLanguage,
});
