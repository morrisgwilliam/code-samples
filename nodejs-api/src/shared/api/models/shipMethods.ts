import {z} from 'zod';


export const ApiShipMethodSchema = z.object({
  ShipMethodId: z.string(),
  method: z.string(),
  TeamId: z.string(),
  default: z.boolean(),
  createdBy: z.string(),
  updatedAt: z.number(),
  createdAt: z.number(),
});

export const ApiCreateShipMethodInputSchema = z.object({
  method: z.string(),
  default: z.boolean(),
});

export const ApiUpdateShipMethodsInputSchema = z.object({
  ShipMethodId: z.string(),
  method: z.string(),
  default: z.boolean(),
});

export const ApiSetDefaultShipMethodInputSchema = z.string();

export const ApiDeleteShipMethodsInputSchema = z.string();

export const ApiAllShipMethodsResponseSchema = z.object({
  total: z.number(),
  size: z.number(),
  page: z.number(),
  results: ApiShipMethodSchema.array(),
});

export type ShipMethods = z.infer<typeof ApiShipMethodSchema>;
export type ShipMethodsUpdateInput = z.infer<typeof ApiUpdateShipMethodsInputSchema>;
export type ShipMethodsCreateInput = z.infer<typeof ApiCreateShipMethodInputSchema>;
export type ShipMethodsDeleteInput = z.infer<typeof ApiDeleteShipMethodsInputSchema>;