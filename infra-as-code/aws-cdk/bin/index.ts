#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DevOpsStack } from '../lib/stacks/dev-ops-stack';
import { WebAppStack } from '../lib/stacks/web-apps-stack';
import { DnsStack } from '../lib/stacks/dns-stack';
import { CognitoStack } from '../lib/stacks/cognito-stack';
import { ApiStack } from '../lib/stacks/api-stack';
import { DataSourcesStack } from '../lib/stacks/datasources-stack';

if(!process.env.DOMAIN_NAME) throw new Error('environment variable DOMAIN_NAME is required');

const app = new cdk.App();
new DevOpsStack(app, 'example-devops-stack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  env: { account: process.env.CDK_ACCOUNT, region: process.env.CDK_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

const dnsStack = new DnsStack(app, 'example-dns-stack', {
  env: { account: process.env.CDK_ACCOUNT, region: process.env.CDK_REGION },
  domainName: process.env.DOMAIN_NAME
})

new WebAppStack(app, 'example-web-app-stack', {
  env: { account: process.env.CDK_ACCOUNT, region: process.env.CDK_REGION },
  zone: dnsStack.HostedZone,
  certificate: dnsStack.Certificate,
  domainName: process.env.DOMAIN_NAME
})


const dataSourcesStack =new DataSourcesStack(app, 'example-data-sources-stack', {
  env: { account: process.env.CDK_ACCOUNT, region: process.env.CDK_REGION },
})

const cognitoStack = new CognitoStack(app, 'example-cognito-stack', {
  env: { account: process.env.CDK_ACCOUNT, region: process.env.CDK_REGION },
  teamsTable: dataSourcesStack.Tables.TEAMS_TABLE
})

new ApiStack(app, 'example-api-stack', {
  zone: dnsStack.HostedZone,
  certificate: dnsStack.Certificate,
  domainName: process.env.DOMAIN_NAME,
  userPool: cognitoStack.userPool,
  authenticatedRole: cognitoStack.authenticatedRole,
  tables: Object.values(dataSourcesStack.Tables),
  opensearch: dataSourcesStack.OpenSearch,
  env: { account: process.env.CDK_ACCOUNT, region: process.env.CDK_REGION },
})