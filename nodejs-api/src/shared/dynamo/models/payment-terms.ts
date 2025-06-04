import {Item} from "dynamoose/dist/Item"
import {SchemaDefinition} from "dynamoose/dist/Schema"
import {model, Schema} from "dynamoose"
import { PaymentTerms } from "../../api"

interface DynamoosePaymentTerm extends Item, PaymentTerms {}

export const paymentTermsSchema: SchemaDefinition = {
    PaymentTermId: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    days: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    default: {
        type: Boolean,
        required: true,
    },
    description: {
        type: String,
    },
    createdBy: {
        type: String,
        required: true,
    },
    TeamId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Number,
        required: true,
    },
    updatedAt: {
        type: Number,
        required: true,
    },
}

export const schemaDefinition: SchemaDefinition = {
    ...paymentTermsSchema,
    PaymentTermId: {
        type: String,
        hashKey: true,
    },
}

const schema = new Schema(schemaDefinition, {
    timestamps: false,
})

export const PaymentTermsModel = model<DynamoosePaymentTerm>("PaymentTerm", schema, {tableName: "example-payment-terms", create: false, waitForActive: false})

export default PaymentTermsModel