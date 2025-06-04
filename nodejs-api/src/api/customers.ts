import { z } from 'zod';
import { TrpcInstance } from '.';
import { API, services, CustomerModel } from "../shared"
import { PaginatedResponse } from '../shared/types';
import { TRPCError } from '@trpc/server';



export function searchCustomers(trpcInstance: TrpcInstance) {
  return (
    trpcInstance.procedure
      .input(API.ApiCustomerSearchInputSchema)  
      .output(API.ApiCustomerSearchResponseSchema)
      .query(async ({input}) => {
          // const results = await services.customers.searchCustomerByCompanyName({
          //   companyName: input.query,
          //   size: input.size,
          //   page: input.page,
          //   teamId: "example team id from context"
          // });

          const results: PaginatedResponse<API.Customer> = {
            page: 0,
            size: 0,
            total: 0,
            results: [],
          }

          return results
      })
  );
}

export function customerGetById(trpcInstance: TrpcInstance) {
  return (
    trpcInstance.procedure
      .input(z.string())
      .output(API.ApiCustomerSchema)
      .query(async ({ input: customerID }) => {
        // const customer = await CustomerModel.get(customerID);
        const response: API.Customer =  {
          CustomerId: "example id",
          code: "customer code",
          details: {companyName: "example company name"},
          updatedAt: new Date().getTime(),
          createdAt: new Date().getTime(),
          TeamId: "example team id",
          createdBy: "example user id",
        } 
        if (!response) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Customer with id: ${customerID} not found`,
          })
        }
        return response
    })
  );
}

export function createCustomer(trpcInstance: TrpcInstance) {

  return (
    trpcInstance.procedure
      .input(API.ApiCreateCustomerInputSchema)
      .output(API.ApiCustomerSchema)
      .mutation(async ({ input }) => {
        try {
          const response: API.Customer =  {
            CustomerId: "example id",
            code: "customer code",
            details: {companyName: "example company name"},
            updatedAt: new Date().getTime(),
            createdAt: new Date().getTime(),
            TeamId: "example team id",
            createdBy: "example user id",
          } 
          return response
        } catch (error) {
          console.error("Error creating customer", error)
          console.error("INPUT:", JSON.stringify(input))
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Unable to create customer`,
          })
        }
    })
  );
}

export function deleteCustomer(trpcInstance: TrpcInstance) {
  return (
    trpcInstance.procedure
      .input(API.ApiDeleteCustomerInputSchema)
      .output(z.void())
      .mutation(async ({ input: customerID }) => {
        try {
          console.info("delete customer from API")
          // await CustomerModel.delete(customerID);
          console.info("customer deleted resolved from api")
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Customer with id: ${customerID} not deleted`,
          })
        }
    })
  );
}

export function updateCustomer(trpcInstance: TrpcInstance) {
  return (
    trpcInstance.procedure
      .input(API.ApiUpdateCustomerInputSchema)
      .output(API.ApiCustomerSchema)
      .mutation(async ({ input: newCustomer }) => {
        try {
          console.info("update customer from API")
          const response: API.Customer =  {
            CustomerId: "example id",
            code: "customer code",
            details: {companyName: "example company name"},
            updatedAt: new Date().getTime(),
            createdAt: new Date().getTime(),
            TeamId: "example team id",
            createdBy: "example user id",
          } 
          return response
        } catch (error) {
          console.error("Error updating customer", error)
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Customer not updated`,
          })
        }
    })
  );
}