/**
 * In-memory fake DB for demo. Data is wiped on server restart.
 */

import type { Shipment, ShipmentState } from '@uai/shared';
import { SHIPMENTS } from './entities/shipments.js';

/** Root-level in-memory store (process-only, lost on restart) */
const store: { shipments: Map<string, Shipment> } = {
  shipments: new Map(),
};

const now = () => new Date().toISOString();
SHIPMENTS.forEach((s) => {
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
      if (state) return list.filter((s) => s.state.includes(state));
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
      patch: Partial<Omit<Shipment, 'id' | 'createdAt'>>
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
