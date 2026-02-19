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
  trackingNumber: string;
  state: ShipmentState[];
  carrier: string;
  origin: ShipmentAddress;
  destination: ShipmentAddress;
  estimatedDelivery: string; // ISO date (current/revised estimate)
  originalEstimatedDelivery: string; // ISO date (initial estimate; for delayed shipments may differ from estimatedDelivery)
  actualDelivery?: string; // ISO date, set when delivered
  delayReason?: string; // set when state is delayed
  /** Current position [lat, lng] for map display */
  actualPosition?: LatLng;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}
