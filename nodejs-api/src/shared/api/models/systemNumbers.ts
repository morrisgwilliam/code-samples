import {z} from 'zod';


export const ApiSystemNumberSchema = z.object({
  SystemNumberId: z.string(),
  nextOrderNo: z.number(),
  nextPackingSlipNo: z.number(),
  nextEstimateNo: z.number(),
  TeamId: z.string(),
  createdBy: z.string(),
  updatedAt: z.number(),
  createdAt: z.number(),
});

export const ApiUpdateSystemNumbersInputSchema = z.object({
  SystemNumberId: z.string(),
  nextOrderNo: z.number(),
  nextPackingSlipNo: z.number(),
  nextEstimateNo: z.number(),
});


export type SystemNumbers = z.infer<typeof ApiSystemNumberSchema>;
export type SystemNumbersUpdateInput = z.infer<typeof ApiUpdateSystemNumbersInputSchema>;