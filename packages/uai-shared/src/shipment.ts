export type ShipmentState = 'inTransit' | 'delayed' | 'delivered';

/** [latitude, longitude] for map display */
export type LatLng = [number, number];

export interface ShipmentAddress {
  city: string;
  country: string;
  addressLine: string;
  /** [lat, lng] for map display */
  position: LatLng;
}

export interface Shipment {
  id: string;
  state: ShipmentState[];
  carrier: string;
  origin: ShipmentAddress;
  destination: ShipmentAddress;
  estimatedDeliveryDate: string; // ISO datetime (minute precision; current/revised estimate)
  originalEstimatedDeliveryDate: string; // ISO datetime (minute precision; initial estimate; for delayed shipments may differ from estimatedDelivery)
  finalDeliveryDate?: string; // ISO datetime (minute precision; set when delivered)
  delayReason?: string; // set when state is delayed
  /** Current position [lat, lng] for map display */
  actualPosition?: LatLng;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}
