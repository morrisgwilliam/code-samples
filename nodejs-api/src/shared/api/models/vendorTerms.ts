import {z} from 'zod';


export const ApiVendorTermSchema = z.object({
  VendorTermId: z.string(),
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

export const ApiCreateVendorTermInputSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  days: z.number(),
  weight: z.number().min(0).max(1),
});

export const ApiUpdateVendorTermsInputSchema = z.object({
  VendorTermId: z.string(),
  description: z.string().optional(),
  weight: z.number().min(0).max(1),
  name: z.string(),
  days: z.number(),
});

export const ApiDeleteVendorTermsInputSchema = z.string();

export const ApiSetDefaultVendorTermInputSchema = z.string();

export const ApiAllVendorTermsResponseSchema = z.object({
  total: z.number(),
  size: z.number(),
  page: z.number(),
  results: ApiVendorTermSchema.array(),
});

export type VendorTerms = z.infer<typeof ApiVendorTermSchema>;
export type VendorTermsSetDefaultInput = z.infer<typeof ApiSetDefaultVendorTermInputSchema>;
export type VendorTermsUpdateInput = z.infer<typeof ApiUpdateVendorTermsInputSchema>;
export type VendorTermsCreateInput = z.infer<typeof ApiCreateVendorTermInputSchema>;
export type VendorTermsDeleteInput = z.infer<typeof ApiDeleteVendorTermsInputSchema>;