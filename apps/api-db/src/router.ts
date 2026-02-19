import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from './db.js';
import { validate } from './validation.js';

export const router = Router();

/** GET /api/shipments?state=inTransit|delayed|delivered */
router.get('/shipments', (req: Request, res: Response) => {
  const query = validate(
    z.object({
      state: z.enum(['inTransit', 'delayed', 'delivered']).optional(),
    }),
    req.query,
    res,
    'Invalid query parameters'
  );
  if (!query) return; // Error already sent

  const { state } = query;
  const shipments = db.shipments.getAll(state);
  res.json(shipments);
});

/** GET /api/shipments/:id */
router.get('/shipments/:id', (req: Request, res: Response) => {
  const params = validate(
    z.object({
      id: z.string().min(1),
    }),
    req.params,
    res,
    'shipment id is required.'
  );
  if (!params) return; // Error already sent

  const { id } = params;
  const shipment = db.shipments.getById(id);
  if (!shipment) {
    res.status(404).json({ error: 'Shipment not found' });
    return;
  }
  res.json(shipment);
});
