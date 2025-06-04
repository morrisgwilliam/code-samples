import {Item} from "dynamoose/dist/Item"
import {SchemaDefinition} from "dynamoose/dist/Schema"
import {model, Schema} from "dynamoose"
import {TaxCode} from "../../api"

interface DynamooseTaxCode extends Item, TaxCode {}

export const taxCodeSchema: SchemaDefinition = {
    TaxCodeId: {
        type: String,
    },
    codeName: {
        type: String,
        required: true,
    },
    default: {
        type: Boolean,
        required: true,
    },
    rate: {
        type: Number,
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
const schemaDefinition: SchemaDefinition = {
    ...taxCodeSchema,
    TaxCodeId: {
        type: String,
        hashKey: true,
    },
}

const schema = new Schema(schemaDefinition, {
    timestamps: false,
})

export const TaxCodesModel = model<DynamooseTaxCode>("TaxCode", schema, {tableName: "example-tax-codes", create: false, waitForActive: false})

export default TaxCodesModel