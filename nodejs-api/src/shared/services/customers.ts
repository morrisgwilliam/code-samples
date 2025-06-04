import DynamoCustomer from "../dynamo/models/customer";
import * as osClient from "../opensearch/index";
import { Customer as CustomerType, CustomerCreate, CustomerUpdateInput } from "../api";
import {v4 as uuid} from 'uuid';
import { PaginatedResponse } from "../types";
import transaction from "dynamoose/dist/Transaction";

export async function getCustomer(customerID: string): Promise<CustomerType | undefined> {
    console.info("fetching from API")
    const customer = await DynamoCustomer.get(customerID);
    console.info("fetching customer from dynamo db by customerId")
    if (!customer) return undefined
    const response: CustomerType =  {
        CustomerId: customer.CustomerId,
        code: customer.code,
        details: customer.details,
        payment: customer.payment,
        billing: customer.billing,
        delivery: customer.delivery,
        contacts: customer.contacts,
        notes: customer.notes,
        updatedAt: customer.updatedAt,
        createdAt: customer.createdAt,
        TeamId: customer.TeamId,
        createdBy: customer.createdBy,
      }
    return response
}

export async function searchCustomerByCompanyName({
  companyName,
  size,
  page,
  teamId
}: {
  companyName: string,
  teamId: string,
  size: number,
  page: number,
}): Promise<PaginatedResponse<CustomerType>> {
    console.info(`searching customers from aoss by companyName: ${companyName} with team id ${teamId}`)
    const results = await osClient.basicSearchOS<CustomerType>({
      index: "customers",
      query: {
        bool: {
            must: [
              {
                "query_string": {
                  query: `*${companyName}*`,
                  "default_field": "details.companyName"
                }
              },
              {
                term: {
                  TeamId: teamId
                }
              }
            ]
          }
        },
      size,
      page,
    });
    return results
}

export async function searchCustomerByCode({
  code,
  size,
  page,
  teamId
}: {
  code: string,
  teamId: string,
  size: number,
  page: number,
}): Promise<PaginatedResponse<CustomerType>> {
  console.info(`searching customers from aoss by Customer Code: ${code} with team id ${teamId}`)
    const results = await osClient.basicSearchOS<CustomerType>({
      index: "customers",
      query: {
          bool: {
            must: [
              {
                query_string: {
                  query : `*${code.toUpperCase()}*`,
                  default_field: "code"
                  },
              },
              {
                term: {
                  TeamId: teamId
                }
              }
            ]
          }
        },
      size,
      page,
    });
    return results
}

export async function searchCustomerByContact({
  contactName,
  size,
  page,
  teamId
}: {
  contactName: string,
  teamId: string,
  size: number,
  page: number,
}): Promise<PaginatedResponse<CustomerType>> {
  console.info(`searching customers from aoss by contact name: ${contactName} with team id ${teamId}`)
    const results = await osClient.basicSearchOS<CustomerType>({
      index: "customers",
      query: {
          bool: {
            must: [
              {
                query_string: {
                  query : `*${contactName}*`,
                  default_field: "contacts.contactName"
                  },
              },
              {
                term: {
                  TeamId: teamId
                }
              }
            ]
          }
        },
      size,
      page,
    });
    return results
}

export async function searchCustomerByCity({
  city,
  size,
  page,
  teamId
}: {
  city: string,
  size: number,
  page: number,
  teamId: string
}): Promise<PaginatedResponse<CustomerType>> {
  console.info("searching customers from aoss by city")
    const results = await osClient.basicSearchOS<CustomerType>({
      index: "customers",
      query: {
          bool: {
            must: [
              {
                query_string: {
                  query : `*${city}*`,
                  default_field: "details.city"
                  },
              },
              {
                term: {
                  TeamId: teamId
                }
              }
            ]
          }
        },
      size,
      page,
    });
    return results
}

export async function searchCustomerByPhone({
  phone,
  size,
  page,
  teamId
}: {
  phone: string,
  size: number,
  page: number,
  teamId: string
}): Promise<PaginatedResponse<CustomerType>> {
  console.info("searching customers from aoss by phone")
    const results = await osClient.basicSearchOS<CustomerType>({
      index: "customers",
      query: {
        bool: {
          must: [
            {
              query_string: {
                query : `*${phone}*`,
                default_field: "details.phone"
              },
            },
            {
              term: {
                TeamId: teamId
              }
            }
          ]
        }
      },
      size,
      page,
    });
    return results
}

export async function searchCustomerByEmail({
  email,
  size,
  page,
  teamId
}: {
  email: string,
  teamId: string,
  size: number,
  page: number,
}): Promise<PaginatedResponse<CustomerType>> {
  console.info(`searching customers from aoss by email: ${email} and team id ${teamId}`)
    const strings = email.split("@")

    const results = await osClient.basicSearchOS<CustomerType>({
      index: "customers",
      query: {
          bool: {
            should: strings.map((s) => ({
                  query_string: {
                    query : `*${s}*`,
                    default_field: "details.email"
                  },
              })),
            minimum_should_match: 1,
            must: [
              {
                term: {
                  TeamId: teamId
                }
              }
            ]
          }
        },
      size,
      page,
    });
  return results
}

export const createCustomer = async (newCustomer: CustomerCreate & {TeamId: string, createdBy: string}): Promise<CustomerType> => {
    console.info("creating customer in dynamo db")

    const customerPayload = {
      ...newCustomer,
      CustomerId: uuid(),
      code: uuid(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    const transactions = [
      DynamoCustomer.transaction.create(customerPayload)
    ]

    await transaction(transactions)

    console.info("created customer")
    const response: CustomerType = customerPayload
    return response
}

export const updateCustomer = async (updatedCustomer: CustomerUpdateInput): Promise<CustomerType> => {
  console.info("updating customer in dynamo db")
    const customer = await DynamoCustomer.update({
        ...updatedCustomer,
        updatedAt: Date.now(),
    });
    console.info("customer updated")
    const response: CustomerType =  {
        CustomerId: customer.CustomerId,
        code: customer.code,
        details: customer.details,
        payment: customer.payment,
        billing: customer.billing,
        delivery: customer.delivery,
        contacts: customer.contacts,
        notes: customer.notes,
        updatedAt: customer.updatedAt,
        createdAt: customer.createdAt,
        TeamId: customer.TeamId,
        createdBy: customer.createdBy,
      } 
    return response
}