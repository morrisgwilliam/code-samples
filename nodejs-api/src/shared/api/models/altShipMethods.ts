import {z} from 'zod';


export const ApiAltShipMethodSchema = z.object({
  AltShipMethodId: z.string(),
  name: z.string(),
  contact: z.string(),
  TeamId: z.string(),
  createdBy: z.string(),
  updatedAt: z.number(),
  createdAt: z.number(),
});

export const ApiCreateAltShipMethodInputSchema = z.object({
  name: z.string(),
  contact: z.string(),
});

export const ApiUpdateAltShipMethodsInputSchema = z.object({
  AltShipMethodId: z.string(),
  name: z.string(),
  contact: z.string(),
});

export const ApiDeleteAltShipMethodsInputSchema = z.string();

export const ApiAllAltShipMethodsResponseSchema = z.object({
  total: z.number(),
  size: z.number(),
  page: z.number(),
  results: ApiAltShipMethodSchema.array(),
});

export type AltShipMethods = z.infer<typeof ApiAltShipMethodSchema>;
export type AltShipMethodsUpdateInput = z.infer<typeof ApiUpdateAltShipMethodsInputSchema>;
export type AltShipMethodsCreateInput = z.infer<typeof ApiCreateAltShipMethodInputSchema>;
export type AltShipMethodsDeleteInput = z.infer<typeof ApiDeleteAltShipMethodsInputSchema>;