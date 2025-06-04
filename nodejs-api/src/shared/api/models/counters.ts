import { z } from 'zod';

const systemNumbers = {
  orderNumber: z.number(),
  saleOrderNumber: z.number(),
  invoiceNumber: z.number(),
  estimateNumber: z.number(),
  packingSlipNumber: z.number(),
}

export const ApiSystemNumbersSchema = z.object(systemNumbers);

export const ApiCounterSchema = z.object({
  TeamId: z.string(),
  customers: z.record(z.number()),
  invoices: z.record(z.number()),
  vendors: z.record(z.number()),
  orders: z.record(z.number()),
  items: z.record(z.number()),
  ...systemNumbers,
  updatedAt: z.number(),
  createdAt: z.number(),
});

export type Counter = z.infer<typeof ApiCounterSchema>;
export type SystemNumbers = z.infer<typeof ApiSystemNumbersSchema>;
