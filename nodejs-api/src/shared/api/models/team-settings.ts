import { z } from 'zod';
import { ApiPaymentTermSchema } from './paymentTerms';

const genericSchema = {
  general: z.object({
    companyName: z.string(),
    phone: z.string().optional(),
    employerId: z.string(),
    additionalIds: z.array(z.string()),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
    website: z.string(),
    email: z.string(),
  }),
  salesTax: z.object({
    reportingMethod: z.enum(["Cash Basis", "Accrual Basis"]),
    isFreightExempt: z.boolean(),
    exemptId: z.string(),
  }),
  purchaseOrders: z.object({
    shipTo: z.string(),
    approximateShipDate: z.string(),
    factory: z.string(),
    purchaseOrder: z.string(),
    shippingDays: z.number().min(0),
    deadlineUse: z.string(),
    trackingDays: z.number().min(0),
    defaultShip: z.string(),
    shipVia: z.string(),
    enableInstructionLine: z.boolean(),
    instructionLine: z.string(),
    finishingLine: z.string(),
    enableFinishingLine: z.boolean(),
  }),
  acknowledgements: z.object({
    soldTo: z.string(),
    shipTo: z.string(),
    approximateShipDate: z.string(),
    deadlineUse: z.string(),
    showCustomerTerms: z.boolean(),
    acknowledgement: z.string(),
    quantity: z.string(),
    shipVia: z.string(),
    enableInstructionLine: z.boolean(),
    instructionLine: z.string(),
    finishingLine: z.string(),
    enableFinishingLine: z.boolean(),
    defaultShip: z.string(),
  }),
  invoices: z.object({
    invoice: z.string(),
    terms: ApiPaymentTermSchema.optional(),
    soldTo: z.string(),
    shipTo: z.string(),
    dateShipped: z.string(),
    shippedMethod: z.string(),
    returnStub: z.string(),
    returnStubEnabled: z.boolean(),
    finishingLine: z.string(),
    enableFinishingLine: z.boolean(),
    showCustomerAddress: z.boolean(),
  }),
  options: z.object({
    askForReorderRequest: z.boolean(),
    elimateHandlingOnInvoice: z.boolean(),
    printTrackingNumber: z.boolean(),
    showIndustryId: z.boolean(),
    notifyContactAttention: z.boolean(),
    enableItemBrowsing: z.boolean(),
    notifyAddressChange: z.boolean(),
    changeMessageCustomerOrderHistory: z.boolean(),
  }),
}

export const ApiSettingsSchema = z.object({
  TeamId: z.string(),
  SettingsId: z.string(),
  updatedAt: z.number(),
  createdAt: z.number(),
  ...genericSchema
});

export const ApiCreateSettingsSchema = z.object({
  ...genericSchema
});

export const ApiUpdateSettingsSchema = z.object({
  TeamId: z.string(),
  SettingsId: z.string(),
  updatedAt: z.number(),
  createdAt: z.number(),
  ...genericSchema
});

  export type Settings = z.infer<typeof ApiSettingsSchema>;
  export type SettingsUpdateInput = z.infer<typeof ApiUpdateSettingsSchema>;
  export type SettingsCreateInput = z.infer<typeof ApiCreateSettingsSchema>;