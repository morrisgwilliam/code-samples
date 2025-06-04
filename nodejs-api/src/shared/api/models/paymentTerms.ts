import {z} from 'zod';


export const ApiPaymentTermSchema = z.object({
  PaymentTermId: z.string(),
  name: z.string(),
  days: z.number(),
  weight: z.number().min(0).max(1),
  default: z.boolean(),
  TeamId: z.string(),
  createdBy: z.string(),
  updatedAt: z.number(),
  createdAt: z.number(),
  description: z.string().optional(),
});

export const ApiCreatePaymentTermInputSchema = z.object({
  name: z.string(),
  days: z.number(),
  weight: z.number().min(0).max(1),
  description: z.string().optional(),
});

export const ApiUpdatePaymentTermsInputSchema = z.object({
  PaymentTermId: z.string(),
  weight: z.number().min(0).max(1),
  name: z.string(),
  days: z.number(),
  description: z.string().optional(),
});

export const ApiDeletePaymentTermsInputSchema = z.string();

export const ApiSetDefaultPaymentTermInputSchema = z.string();

export const ApiAllPaymentTermsResponseSchema = z.object({
  total: z.number(),
  size: z.number(),
  page: z.number(),
  results: ApiPaymentTermSchema.array(),
});

export type PaymentTerms = z.infer<typeof ApiPaymentTermSchema>;
export type PaymentTermsSetDefaultInput = z.infer<typeof ApiSetDefaultPaymentTermInputSchema>;
export type PaymentTermsUpdateInput = z.infer<typeof ApiUpdatePaymentTermsInputSchema>;
export type PaymentTermsCreateInput = z.infer<typeof ApiCreatePaymentTermInputSchema>;
export type PaymentTermsDeleteInput = z.infer<typeof ApiDeletePaymentTermsInputSchema>;