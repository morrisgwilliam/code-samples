import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { customerGetById, createCustomer, searchCustomers, deleteCustomer, updateCustomer } from './customers';
const trpcInstance = initTRPC.create();

export type TrpcInstance = typeof trpcInstance;

export const appRouter = trpcInstance.router({
  // CUSTOMERS//
  customerById: customerGetById(trpcInstance),
  createCustomer: createCustomer(trpcInstance),
  searchCustomers: searchCustomers(trpcInstance),
  deleteCustomer: deleteCustomer(trpcInstance),
  updateCustomer: updateCustomer(trpcInstance),
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000);