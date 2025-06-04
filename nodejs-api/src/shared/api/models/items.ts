import { z } from 'zod';

export const ApiAssemblySchema = z.object({
  sequence: z.number().optional(),
  itemNumber: z.string().optional(),
  description: z.string().optional(),
  quantityRequired: z.number().optional(),
  cost: z.number().optional(),
  extendedPrice: z.number().optional(),
});

export const ApiPriceBreaksSchema = z.object({
  quantity: z.number().optional(),
  price: z.number().optional(),
  cost: z.number().optional(),
});

const baseSchema = {
  details: z.object({
    category: z.string().optional(),
    taxable: z.boolean(),
    commissionable: z.boolean(),
    commissionRate: z.number()
      .min(0, "Commission Rate must be greater than 0")
      .max(1, "Commission Rate must be less than 1")
      .optional(),
    assemblyItem: z.boolean(),
    description: z.string(),
    itemLink: z.string().optional(),
    vendorCost: z.number().optional(),
    customerPrice: z.number(),
    primaryVendor: z.string().optional(), //
    primaryVendorID: z.string().optional(), //
    vendorItemNumber: z.string(),
    customerItemNumber: z.string().optional(),
    unit: z.string(),
    onHand: z.number().optional(),
    minimumRequirements: z.number(),
    averageCost: z.number().optional(),
    reorder: z.string().optional(),
    backOrder: z.number().optional(),
    onOrder: z.number().optional(),
  }),
  priceBreaks: z.array(ApiPriceBreaksSchema),
  assembly: z.array(ApiAssemblySchema)
}

export const ApiItemSchema = z.object({
  ItemId: z.string(),
  ...baseSchema,
  updatedAt: z.number(),
  createdAt: z.number(),
  createdBy: z.string(),
  TeamId: z.string(),
});

export const ApiCreateItemInputSchema = z.object({
  ...baseSchema,
});

export const ApiUpdateItemInputSchema = z.object({
  ItemId: z.string(),
  ...baseSchema,
});

export const ApiGetItemInputSchema = z.string();

export const ApiDeleteItemInputSchema = z.string();


export const ApiItemSearchInputSchema = z.object({
  query: z.string(),
  searchBy: z.enum(['vendorName', 'vendorItemNumber']),
  size: z.number(),
  page: z.number(),
});

export const ApiItemSearchResponseSchema = z.object({
  total: z.number(),
  size: z.number(),
  page: z.number(),
  results: ApiItemSchema.array(),
});


export type Item = z.infer<typeof ApiItemSchema>;
export type ItemCreate = z.infer<typeof ApiCreateItemInputSchema>;
export type ItemUpdateInput = z.infer<typeof ApiUpdateItemInputSchema>;
export type ItemDeleteInput = z.infer<typeof ApiDeleteItemInputSchema>;

export type ItemAssembly = z.infer<typeof ApiAssemblySchema>;
export type ItemPriceBreak = z.infer<typeof ApiPriceBreaksSchema>;

export type ItemSearchInput = z.infer<typeof ApiItemSearchInputSchema>;
export type ItemSearchOutput = z.infer<typeof ApiItemSearchResponseSchema>;