import { z } from 'zod';
import { ApiPaymentTermSchema } from './paymentTerms';

export const  ApiOrderItemSchema = z.object({
  quantityOrdered: z.number(),
  quantityShipped: z.number(),
  unitNumber: z.string(),
  itemId: z.string(),
  vendorItemNumber: z.string(),
  customerItemNumber: z.string(),
  description: z.string(),
  vendorCost: z.number(),
  customerPrice: z.number(),
  taxable: z.boolean(),
  commissionable: z.boolean(),
  commissionRate: z.number()
    .min(0, "Commission Rate must be greater than 0")
    .max(1, "Commission Rate must be less than 1")
    .optional(),
});

const baseSchema = {
  code: z.string(),
  rate: z.number(),
  estimatedShipDate: z.number(),
  customerDeposit: z.number(),
  shipMethod: z.string(),
  deadline: z.number(),
  orderDate: z.number(),
  paymentTerms: z.array(ApiPaymentTermSchema),
  customer: z.object({
    CustomerId: z.string(),
    code: z.string(),
    companyName: z.string(),
  }),
  items: z.array(ApiOrderItemSchema),
  specialInstructions: z.string().optional(),
}

export const ApiOrderSchema = z.object({
  OrderId: z.string(),
  ...baseSchema,
  updatedAt: z.number(),
  createdAt: z.number(),
  createdBy: z.string(),
  TeamId: z.string(),
});

export const ApiCreateOrderInputSchema = z.object({
  ...baseSchema,
});

export const ApiUpdateOrderInputSchema = z.object({
  OrderId: z.string(),
  ...baseSchema,
});

export const ApiGetOrderInputSchema = z.string();

export const ApiDeleteOrderInputSchema = z.string();


export const ApiOrderSearchInputSchema = z.object({
  query: z.string(),
  searchBy: z.enum(['customerId', 'orderCode', 'companyName']),
  size: z.number(),
  page: z.number(),
});

export const ApiOrderSearchResponseSchema = z.object({
  total: z.number(),
  size: z.number(),
  page: z.number(),
  results: ApiOrderSchema.array(),
});


  export type Order = z.infer<typeof ApiOrderSchema>;
  export type OrderItem = z.infer<typeof ApiOrderItemSchema>;
  export type OrderCreateInput = z.infer<typeof ApiCreateOrderInputSchema>;
  export type OrderUpdateInput = z.infer<typeof ApiUpdateOrderInputSchema>;
  export type OrderDeleteInput= z.infer<typeof ApiDeleteOrderInputSchema>;
  
  
  export type OrderSearchInput = z.infer<typeof ApiOrderSearchInputSchema>;
  export type OrderSearchOutput = z.infer<typeof ApiOrderSearchResponseSchema>;