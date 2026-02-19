/**
 * In-memory fake DB for demo. Data is wiped on server restart.
 */

import type { Shipment, ShipmentState } from '@uai/shared';

/** Root-level in-memory store (process-only, lost on restart) */
const store: { shipments: Map<string, Shipment> } = {
  shipments: new Map(),
};

// Seed demo data
const DEMO_SHIPMENTS: Omit<Shipment, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'shp-1',
    trackingNumber: '1Z999AA10123456784',
    state: 'inTransit',
    carrier: 'UPS',
    origin: {
      city: 'Warsaw',
      country: 'PL',
      addressLine: 'ul. Marszałkowska 1',
      position: [52.23, 21.01],
    },
    destination: {
      city: 'Berlin',
      country: 'DE',
      addressLine: 'Friedrichstraße 123',
      position: [52.52, 13.4],
    },
    estimatedDelivery: '2025-02-22',
    originalEstimatedDelivery: '2025-02-22',
    actualPosition: [52.4, 16.9], // between Warsaw and Berlin (Poznań area)
  },
  {
    id: 'shp-2',
    trackingNumber: 'DHL9876543210PL',
    state: 'delayed',
    carrier: 'DHL',
    origin: {
      city: 'Kraków',
      country: 'PL',
      addressLine: 'ul. Floriańska 15',
      position: [50.06, 19.94],
    },
    destination: {
      city: 'Munich',
      country: 'DE',
      addressLine: 'Marienplatz 1',
      position: [48.14, 11.58],
    },
    estimatedDelivery: '2025-02-20',
    originalEstimatedDelivery: '2025-02-19',
    delayReason: 'Customs clearance',
    actualPosition: [49.5, 17.5], // near PL/DE border (customs)
  },
  {
    id: 'shp-3',
    trackingNumber: 'FEDEX555666777',
    state: 'delivered',
    carrier: 'FedEx',
    origin: {
      city: 'Gdańsk',
      country: 'PL',
      addressLine: 'Długi Targ 1',
      position: [54.35, 18.65],
    },
    destination: {
      city: 'Amsterdam',
      country: 'NL',
      addressLine: 'Damrak 1',
      position: [52.37, 4.89],
    },
    estimatedDelivery: '2025-02-18',
    originalEstimatedDelivery: '2025-02-18',
    actualDelivery: '2025-02-18T16:45:00.000Z',
    actualPosition: [52.37, 4.89], // Amsterdam (delivered at destination)
  },
  {
    id: 'shp-4',
    trackingNumber: 'INPOST123456789',
    state: 'inTransit',
    carrier: 'InPost',
    origin: {
      city: 'Wrocław',
      country: 'PL',
      addressLine: 'Rynek 1',
      position: [51.11, 17.04],
    },
    destination: {
      city: 'Prague',
      country: 'CZ',
      addressLine: 'Staroměstské nám. 1',
      position: [50.08, 14.44],
    },
    estimatedDelivery: '2025-02-23',
    originalEstimatedDelivery: '2025-02-23',
    actualPosition: [50.5, 15.5], // between Wrocław and Prague
  },
  {
    id: 'shp-5',
    trackingNumber: 'DPD444333222',
    state: 'delayed',
    carrier: 'DPD',
    origin: {
      city: 'Poznań',
      country: 'PL',
      addressLine: 'Stary Rynek 1',
      position: [52.41, 16.93],
    },
    destination: {
      city: 'Vienna',
      country: 'AT',
      addressLine: 'Stephansplatz 1',
      position: [48.21, 16.37],
    },
    estimatedDelivery: '2025-02-21',
    originalEstimatedDelivery: '2025-02-20',
    delayReason: 'Weather conditions',
    actualPosition: [50.0, 17.0], // between Poznań and Vienna (delayed)
  },
];

const now = () => new Date().toISOString();
DEMO_SHIPMENTS.forEach((s) => {
  const shipment: Shipment = {
    ...s,
    createdAt: now(),
    updatedAt: now(),
  };
  store.shipments.set(shipment.id, shipment);
});

export const db = {
  shipments: {
    getAll(state?: ShipmentState): Shipment[] {
      const list = Array.from(store.shipments.values());
      if (state) return list.filter((s) => s.state === state);
      return list;
    },
    getById(id: string): Shipment | undefined {
      return store.shipments.get(id);
    },
    create(data: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'>): Shipment {
      const id = `shp-${Date.now()}`;
      const createdAt = now();
      const shipment: Shipment = {
        ...data,
        id,
        createdAt,
        updatedAt: createdAt,
      };
      store.shipments.set(id, shipment);
      return shipment;
    },
    update(
      id: string,
      patch: Partial<Omit<Shipment, 'id' | 'createdAt'>>,
    ): Shipment | undefined {
      const existing = store.shipments.get(id);
      if (!existing) return undefined;
      const updated: Shipment = {
        ...existing,
        ...patch,
        id: existing.id,
        createdAt: existing.createdAt,
        updatedAt: now(),
      };
      store.shipments.set(id, updated);
      return updated;
    },
    delete(id: string): boolean {
      return store.shipments.delete(id);
    },
  },
};
