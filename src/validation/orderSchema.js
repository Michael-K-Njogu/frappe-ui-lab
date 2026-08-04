import { z } from 'zod';

const baseOrderSchema = z.object({
  customerId: z
    .string()
    .min(1, { message: 'Please select a customer from the list' }),

  status: z
    .string()
    .min(1, { message: 'Please select a status' }),

  totalAmount: z
    .number({ invalid_type_error: 'Total amount must be a number' })
    .positive({ message: 'Total amount must be a positive number' }),

  notes: z
    .string()
    .optional(),
});

export const createOrderSchema = baseOrderSchema;

export const updateOrderSchema = baseOrderSchema;