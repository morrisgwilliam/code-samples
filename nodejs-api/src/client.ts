import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './api';
//     👆 **type-only** import
 
// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
    }),
  ],
});

(async () => {
    const customer = await client.customerById.query('example-customer-id')

    console.log('Customer:', customer);

    const searchResults = await client.searchCustomers.query({
        query: 'example company',
        searchBy: 'companyName',
        size: 10,
        page: 1,
    });

    console.log('Search Results:', searchResults);
})()