import { z } from 'zod';
import { ApiVendorTermSchema} from "./vendorTerms";

const baseContactSchema = {
  contactName: z.string().optional(),
  address: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  preferredCommunication: z.string().optional(),
  position: z.string().optional(),
}

const baseSchema = {
  details: z.object({
    companyName: z.string(),
    accountNumber: z.string(),
    address: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    employerIdentificationNumber: z.string().optional(),
    preferredCommunication: z.string().optional(),
    website: z.string().optional(),
    other: z.string().optional()
  }),
  payment: z.object({
    rebates: z.boolean().optional(),
    vendorTerms: z.array(ApiVendorTermSchema).optional(),
    currentBalance: z.number().optional(),
    lastOrderDate: z.number().optional(),
    percentage: z.number().optional(),
    minimum: z.number().optional(),
    volume: z.number().optional(),
  }).optional(),
  shipping: z.object({
    companyName: z.string().optional(),
    address: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    preferredCommunication: z.string().optional(),
    contactName: z.string().optional(),
  }).optional(),
  receivable: z.object({
    companyName: z.string().optional(),
    address: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    preferredCommunication: z.string().optional(),
    contactName: z.string().optional(),
  }).optional(),
  contacts: z.array(z.object(baseContactSchema)).optional(),
  notes: z.string().optional(),
  showNotes: z.boolean().optional(),
}

export const ApiVendorSchema = z.object({
  VendorId: z.string(),
  code: z.string(),
  ...baseSchema,
  updatedAt: z.number(),
  createdAt: z.number(),
  createdBy: z.string(),
  TeamId: z.string(),
});

export const ApiCreateVendorInputSchema = z.object({
  ...baseSchema,
});

export const ApiCreateVendorContactInputSchema = z.object(baseContactSchema)

export const ApiUpdateVendorInputSchema = z.object({
  VendorId: z.string(),
  ...baseSchema,
});

export const ApiGetVendorInputSchema = z.string();

export const ApiDeleteVendorInputSchema = z.string();


export const ApiVendorSearchInputSchema = z.object({
  query: z.string(),
  searchBy: z.enum(['code', 'vendorName', 'contact', 'city', 'phone', 'email']),
  size: z.number(),
  page: z.number(),
});

export const ApiVendorSearchResponseSchema = z.object({
  total: z.number(),
  size: z.number(),
  page: z.number(),
  results: ApiVendorSchema.array(),
});


  export type Vendor = z.infer<typeof ApiVendorSchema>;
  export type VendorCreate = z.infer<typeof ApiCreateVendorInputSchema>;
  export type VendorUpdateInput = z.infer<typeof ApiUpdateVendorInputSchema>;
  export type VendorDeleteInput= z.infer<typeof ApiDeleteVendorInputSchema>;
  
  
  export type VendorContactCreate = z.infer<typeof ApiCreateVendorContactInputSchema>;
  
  export type VendorSearchInput = z.infer<typeof ApiVendorSearchInputSchema>;
  export type VendorSearchOutput = z.infer<typeof ApiVendorSearchResponseSchema>;