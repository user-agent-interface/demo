import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from './db.js';
import { validate } from './validation.js';

export const router = Router();

const LatLngSchema = z.tuple([z.number(), z.number()]);

const ShipmentAddressSchema = z.object({
  city: z.string(),
  country: z.string(),
  addressLine: z.string(),
  position: LatLngSchema,
});

const UpdateShipmentBodySchema = z
  .object({
    state: z.array(z.enum(['inTransit', 'delayed', 'delivered'])).optional(),
    carrier: z.string().optional(),
    origin: ShipmentAddressSchema.optional(),
    destination: ShipmentAddressSchema.optional(),
    estimatedDeliveryDate: z.string().optional(),
    originalEstimatedDeliveryDate: z.string().optional(),
    finalDeliveryDate: z.string().optional(),
    delayReason: z.string().optional(),
    actualPosition: LatLngSchema.optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: 'At least one field must be provided for update',
      path: [],
    }
  );

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

/** POST /api/shipments/:id - update shipment */
router.post('/shipments/:id', (req: Request, res: Response) => {
  const params = validate(
    z.object({
      id: z.string().min(1),
    }),
    req.params,
    res,
    'shipment id is required.'
  );
  if (!params) return; // Error already sent

  const body = validate(
    UpdateShipmentBodySchema,
    req.body,
    res,
    'Invalid shipment update payload'
  );
  if (!body) return; // Error already sent

  const updated = db.shipments.update(params.id, body);
  if (!updated) {
    res.status(404).json({ error: 'Shipment not found' });
    return;
  }

  res.json(updated);
});
