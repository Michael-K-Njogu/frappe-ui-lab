import { z } from 'zod';

const baseCustomerSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' }),

  email: z
    .string()
    .email({ message: 'Invalid email address' }),

  creditLimit: z
    .number()
    .positive({ message: 'Credit limit must be a positive number' })
    .max(100000, { message: 'Credit limit cannot exceed 100,000' }),

  customerType: z
    .string()
    .min(1, { message: 'Please select a customer type' }),

});

export const createCustomerSchema = baseCustomerSchema.extend({
  acceptedTerms: z
    .boolean()
    .refine((value) => value === true, {
      message: 'You must accept the terms and conditions',
    }),
})

export const updateCustomerSchema = baseCustomerSchema