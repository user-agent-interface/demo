import { defineComponentMap } from '@uai/client';
import { showShipments, selectShipment } from './shipments';
import { signOut } from './sign-out';
import { changeLanguage } from './change-language';
import { updateShipment } from './update-shipment';

export const componentMap = defineComponentMap({
  showShipments,
  selectShipment,
  updateShipment,
  signOut,
  changeLanguage,
});
