import {Item} from "dynamoose/dist/Item"
import {SchemaDefinition} from "dynamoose/dist/Schema"
import {model, Schema} from "dynamoose"
import { Customer } from "../../api"
import { taxCodeSchema, paymentTermsSchema } from "./"


interface DynamooseCustomer extends Item, Customer {}

const details = {
    type: Object,
    schema: {
        companyName: {
            type: String,
            required: true,
        },
        address: String,
        state: String,
        city: String,
        zipCode: String,
        country: String,
        email: String,
        phone: String,
        preferredCommunication: String,
        website: String,
        other: String,
    }
}

const payment = {
    type: Object,
    schema: {
        taxable: Boolean,
        taxCode: {
            type: Object,
            schema: taxCodeSchema,
        },
        exemptCode: String,
        paymentTerms: {
            type: Array,
            schema: [{
                type: Object,
                schema: paymentTermsSchema
            }],
        },
        currentBalance: Number,
        creditLimit: Number,
        lastOrderDate: Number,
        averageDays: Number,
    }
}

const billing = {
    type: Object,
    schema: {
        companyName: String,
        address: String,
        state: String,
        city: String,
        zipCode: String,
        country: String,
        email: String,
        phone: String,
        preferredCommunication: String,
        contactName: String,
    }
}

const delivery = {
    type: Object,
    schema: {
        companyName: String,
        address: String,
        state: String,
        city: String,
        zipCode: String,
        country: String,
        email: String,
        phone: String,
        preferredCommunication: String,
        contactName: String,
    }
}

const contact = {
    type: Object,
    schema: {
        contactName: String,
        address: String,
        state: String,
        city: String,
        zipCode: String,
        country: String,
        email: String,
        phone: String,
        preferredCommunication: String,
        position: String,
    }
}

const schemaDefinition: SchemaDefinition = {
    CustomerId: {
        type: String,
        hashKey: true,
    },
    details,
    payment,
    billing,
    delivery: {
        type: Array,
        schema: [delivery],
    },
    contacts: {
        type: Array,
        schema: [contact],
    },
    code: {
        type: String,
        required: true
    },
    notes: String,
    createdAt: {
        type: Number,
        required: true,
    },
    updatedAt: {
        type: Number,
        required: true,
    },
    TeamId: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
}

const schema = new Schema(schemaDefinition, {
    timestamps: false,
    saveUnknown: [
        "payment.**",
        "delivery.**",
    ]
})

export const CustomerModel = model<DynamooseCustomer>("Customer", schema, {tableName: "example-customers", create: false, waitForActive: false})

export default CustomerModel