import { z } from 'zod';

const baseOrderSchema = z.object({
  customerId: z
    .string()
    .min(1, { message: 'Please select a customer from the list' }),

  notes: z
    .string()
    .optional(),
});

export const createOrderSchema = baseOrderSchema;

export const updateOrderSchema = baseOrderSchema;