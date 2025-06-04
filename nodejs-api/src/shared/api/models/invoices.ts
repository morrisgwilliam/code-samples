import { z } from 'zod';
import { ApiTaxCodeSchema } from './taxCodes';
import { ApiPaymentTermSchema } from './paymentTerms';
import { ApiCustomerDeliveryAddressSchema } from './customers';

export const  ApiInvoiceItemSchema = z.object({
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
  orderId: z.string(),
  code: z.string(),
  estimatedShipDate: z.number(),
  customerDeposit: z.number(),
  shipMethod: z.string(),
  deadline: z.number(),
  invoiceDate: z.number(),
  commissionable: z.boolean(),
  paymentTerms: z.array(ApiPaymentTermSchema),
  taxCode: ApiTaxCodeSchema.optional(),
  poShipTo: ApiCustomerDeliveryAddressSchema,
  invoiceShipTo: ApiCustomerDeliveryAddressSchema,
  customer: z.object({
    CustomerId: z.string(),
    code: z.string(),
    companyName: z.string(),
  }),
  items: z.array(ApiInvoiceItemSchema),
  invoiceMemos: z.string().optional(),
  customerFreight: z.number(),
  applyServiceCharge: z.boolean(),
  monthlyServiceCharge: z.number(),
  gracePeriod: z.number(),
  commissionAdjustmentExplanation: z.string(),
  commissionAdjustment: z.number(),
  voidDate: z.number().optional()
}

export const ApiInvoiceSchema = z.object({
  InvoiceId: z.string(),
  ...baseSchema,
  updatedAt: z.number(),
  createdAt: z.number(),
  createdBy: z.string(),
  TeamId: z.string(),
});

export const ApiCreateInvoiceInputSchema = z.object({
  ...baseSchema,
});

export const ApiUpdateInvoiceInputSchema = z.object({
  InvoiceId: z.string(),
  ...baseSchema,
});

export const ApiGetInvoiceInputSchema = z.string();

export const ApiVoidInvoiceInputSchema = z.string();


export const ApiInvoiceSearchInputSchema = z.object({
  query: z.string(),
  searchBy: z.enum(['customerId', 'invoiceCode', 'companyName', 'invoiceId']),
  size: z.number(),
  page: z.number(),
});

export const ApiInvoiceSearchResponseSchema = z.object({
  total: z.number(),
  size: z.number(),
  page: z.number(),
  results: ApiInvoiceSchema.array(),
});


  export type Invoice = z.infer<typeof ApiInvoiceSchema>;
  export type InvoiceItem = z.infer<typeof ApiInvoiceItemSchema>;
  export type InvoiceCreateInput = z.infer<typeof ApiCreateInvoiceInputSchema>;
  export type InvoiceUpdateInput = z.infer<typeof ApiUpdateInvoiceInputSchema>;
  export type InvoiceVoidInput= z.infer<typeof ApiVoidInvoiceInputSchema>;
  
  export type InvoiceSearchInput = z.infer<typeof ApiInvoiceSearchInputSchema>;
  export type InvoiceSearchOutput = z.infer<typeof ApiInvoiceSearchResponseSchema>;