import { z } from 'zod';
import { ApiPaymentTermSchema } from "./paymentTerms";
import { ApiTaxCodeSchema } from './taxCodes';

const baseCustomerContactSchema = {
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

const customerDeliveryAddress = {
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
}

export const baseSchema ={
  details: z.object({
    companyName: z.string(),
    address: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    preferredCommunication: z.string().optional(),
    website: z.string().optional(),
    other: z.string().optional()
  }),
  payment: z.object({
    taxable: z.boolean().optional(),
    taxCode: ApiTaxCodeSchema.optional(),
    exemptCode: z.string().optional(),
    paymentTerms: z.array(ApiPaymentTermSchema).optional(),
    currentBalance: z.number().optional(),
    creditLimit: z.number().optional(),
    lastOrderDate: z.number().optional(),
    averageDays: z.number().optional(),
  }).optional(),
  billing: z.object({
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
  delivery: z.array(z.object(customerDeliveryAddress)).optional(),
  contacts: z.array(z.object(baseCustomerContactSchema)).optional(),
  notes: z.string().optional(),
};

export const ApiCustomerSchema = z.object({
  CustomerId: z.string(),
  code: z.string(),
  ...baseSchema,
  updatedAt: z.number(),
  createdAt: z.number(),
  createdBy: z.string(),
  TeamId: z.string(),
});

export const ApiCreateCustomerInputSchema = z.object(baseSchema);

export const ApiCustomerDeliveryAddressSchema = z.object(customerDeliveryAddress);

export const ApiCreateCustomerContactInputSchema = z.object(baseCustomerContactSchema)

export const ApiUpdateCustomerInputSchema = z.object({
  CustomerId: z.string(),
  ...baseSchema,
});

export const ApiGetCustomerInputSchema = z.string();

export const ApiDeleteCustomerInputSchema = z.string();


export const ApiCustomerSearchInputSchema = z.object({
  query: z.string(),
  searchBy: z.enum(['code', 'companyName', 'contact', 'city', 'phone', 'email']),
  size: z.number(),
  page: z.number(),
});

export const ApiCustomerSearchResponseSchema = z.object({
  total: z.number(),
  size: z.number(),
  page: z.number(),
  results: ApiCustomerSchema.array(),
});


export type Customer = z.infer<typeof ApiCustomerSchema>;
export type CustomerCreate = z.infer<typeof ApiCreateCustomerInputSchema>;
export type CustomerUpdateInput = z.infer<typeof ApiUpdateCustomerInputSchema>;
export type CustomerDeleteInput = z.infer<typeof ApiDeleteCustomerInputSchema>;

export type CustomerDeliveryAddress = z.infer<typeof ApiCustomerDeliveryAddressSchema>;

export type CustomerContactCreate = z.infer<typeof ApiCreateCustomerContactInputSchema>;

export type CustomerSearchInput = z.infer<typeof ApiCustomerSearchInputSchema>;
export type CustomerSearchOutput = z.infer<typeof ApiCustomerSearchResponseSchema>;