import { z } from 'zod';

export const ApiTaxCodeSchema = z.object({
  TaxCodeId: z.string(),
  codeName: z.string(),
  description: z.string(),
  rate: z.number(),
  TeamId: z.string(),
  default: z.boolean(),
  createdBy: z.string(),
  updatedAt: z.number(),
  createdAt: z.number(),
});

export const ApiCreateTaxCodeSchemaInputSchema = z.object({
  codeName: z.string(),
  description: z.string(),
  rate: z.number(),
});

export const ApiUpdateTaxCodeSchemaInputSchema = z.object({
  TaxCodeId: z.string(),
  codeName: z.string(),
  description: z.string(),
  rate: z.number(),
});

export const ApiDeleteTaxCodeInputSchema = z.string();

export const ApiSetDefaultTaxCodeInputSchema = z.string();

export const ApiAllTaxCodesResponseSchema = z.object({
  total: z.number(),
  size: z.number(),
  page: z.number(),
  results: ApiTaxCodeSchema.array(),
});

export const ApiDeleteTaxCodeSchemaInputSchema = z.string();

export type TaxCode = z.infer<typeof ApiTaxCodeSchema>;
export type TaxCodeCreateInput = z.infer<typeof ApiCreateTaxCodeSchemaInputSchema>;
export type TaxCodeUpdateInput = z.infer<typeof ApiUpdateTaxCodeSchemaInputSchema>;
export type TaxCodesSetDefaultInput = z.infer<typeof ApiSetDefaultTaxCodeInputSchema>;
export type TaxCodesAllResponse = z.infer<typeof ApiAllTaxCodesResponseSchema>;