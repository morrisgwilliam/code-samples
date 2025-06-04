import { z } from 'zod';

export const ApiItemCategoriesSchema = z.object({
  TeamId: z.string(),
  categories: z.array(z.string()),
  updatedAt: z.number(),
  createdAt: z.number(),
});


export const ApiUpdateItemCategoriesSchema = z.object({
  categories: z.array(z.string()),
});

  export type ItemCategories = z.infer<typeof ApiItemCategoriesSchema>;
  export type ItemCategoriesUpdate = z.infer<typeof ApiUpdateItemCategoriesSchema>;
