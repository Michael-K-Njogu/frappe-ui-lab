import { z } from 'zod'

const baseOrderItemSchema = z.object({

  productId: z
    .string()
    .min(1, {
      message: 'Please select a product from the list',
    }),

  quantity: z
    .number({
      invalid_type_error: 'Quantity must be a number',
    })
    .positive({
      message: 'Quantity must be greater than zero',
    }),

  discount: z
    .number({
      invalid_type_error: 'Discount must be a number',
    })
    .nonnegative({
      message: 'Discount cannot be negative',
    })
    .default(0),

})

.superRefine((data, ctx) => {

  if (data.discount < 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['discount'],
      message: 'Discount cannot be negative',
    })
  }

})

export const createOrderItemSchema = baseOrderItemSchema
export const updateOrderItemSchema = baseOrderItemSchema