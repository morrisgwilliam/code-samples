import { Client } from '@opensearch-project/opensearch'
import { defaultProvider } from '@aws-sdk/credential-provider-node'
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws-v3' // use aws-v3 import path if you are using aws-sdk v3
import { PaginatedResponse } from "../types";
// Unlike the import path in the v2 example above that lazy loads both aws-sdk v3 credential providers & entire aws-sdk v2 if available
// This will only lazy load the aws-sdk v3 credential providers

export let url = process.env.osEndpoint || 'https://search-xxx.region.aoss.amazonaws.com'; // OpenSearch Serverless endpoint URL



export const client = new Client({
  ...AwsSigv4Signer({
    region: 'us-east-1',
    service: 'aoss',
    // Example with AWS SDK V3:
    getCredentials: async () => {
      // Any other method to acquire a new Credentials object can be used.
      const credentialsProvider = defaultProvider();
      return credentialsProvider();
    },
  }),
  requestTimeout: 60000, // Also used for refreshing credentials in advance
//node: 'https://search-xxx.region.es.amazonaws.com', // OpenSearch domain URL
  node: url //for OpenSearch Serverless
});

export const basicSearchOS = async <T>({ index, query, page, size, sortBy }: {
  index: string,
  query: any,
  size: number,
  page: number,
  sortBy?: string,
}): Promise<PaginatedResponse<T>> => {

  try {
    const defaultSize = 100;
    const defaultPage = 0;
    const defaultSort = 'createdAt';
    const _size = size || defaultSize
    const _page =  (page || defaultPage)
    const searchPayload = {
      index,
      body: {
        query,
        sort: [{ [sortBy || defaultSort]: { order: 'desc' }}],
        size: _size,
        from: _size * _page,
      },
    };

    const results = await client.search(searchPayload);
    const sources = results.body.hits.hits.map((hit: any) => hit._source as T);
    const response: PaginatedResponse<T> = {
      total: results.body.hits.total.value,
      results: sources,
      size: _size,
      page: _page
    }
    return response

  } catch (error) {
      console.error("error when executing aoss search", JSON.stringify(error, null, 2))
      return {
        total: -1,
        results: [],
        size: 0,
        page: 0
      }
  }

  
};


export default client