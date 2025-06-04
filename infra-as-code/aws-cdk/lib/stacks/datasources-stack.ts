import {
AttributeType,
ITable,
Table,
StreamViewType
} from 'aws-cdk-lib/aws-dynamodb';
import {
App,
  Duration,
RemovalPolicy,
Stack,
StackProps,
aws_opensearchserverless,
aws_opensearchserverless as opensearch,
} from 'aws-cdk-lib';

import {
  Code,
  Function,
  Runtime,
  StartingPosition
  } from 'aws-cdk-lib/aws-lambda';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import {
CompositePrincipal,
Effect,
PolicyStatement,
Role,
ServicePrincipal
} from 'aws-cdk-lib/aws-iam';

export interface ITables {
  ACCOUNTS_TABLE: ITable,
  CUSTOMERS_TABLE: ITable,
  TEAMS_TABLE: ITable,
};

export class DataSourcesStack extends Stack {
  public readonly Tables : ITables;
  public readonly OpenSearch : opensearch.CfnCollection;
  public lambdaExecutionRole: Role | undefined;
  // eslint-disable-next-line no-unused-vars
  constructor(app: App, id: string, props: StackProps) {
    super(app, id);

    const ACCOUNTS_TABLE = new Table(this, 'accounts-table', {
      partitionKey: {
        name: 'AccountId',
        type: AttributeType.STRING
      },
      tableName: 'example-accounts',
      removalPolicy: process.env.ENVIRONMENT === 'production' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
    });
    const CUSTOMERS_TABLE = new Table(this, 'customers-table', {
      partitionKey: {
        name: 'CustomerId',
        type: AttributeType.STRING
      },
      tableName: 'example-customers',
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: process.env.ENVIRONMENT === 'production' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      
    });
    const TEAMS_TABLE = new Table(this, 'teams-table', {
      partitionKey: {
        name: 'TeamId',
        type: AttributeType.STRING
      },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
      tableName: 'example-teams',
      removalPolicy: process.env.ENVIRONMENT === 'production' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
    });

    this.Tables = {
      ACCOUNTS_TABLE,
      CUSTOMERS_TABLE,
      TEAMS_TABLE,
    };


    /* OPENSEARCH SERVERLESS */
    const collectionName = 'example'
    const cfnSecurityPolicy = new opensearch.CfnSecurityPolicy(this, 'opensearch-encryption-policy', {
      name: 'example-encryption-policy',
      policy: `{"Rules":[{"ResourceType":"collection","Resource":["collection/${collectionName}"]}],"AWSOwnedKey":true}`,
      type: 'encryption',
    });

    const cfnSecurityNetworkPolicy = new opensearch.CfnSecurityPolicy(this, 'opensearch-network-policy', {
      name: 'example-network-policy',
      policy: `[{"Rules":[{"ResourceType":"collection","Resource":["collection/${collectionName}"]},{"ResourceType":"dashboard","Resource":["collection/${collectionName}"]}],"AllowFromPublic":true}]`,
      type: 'network',
    });

    this.OpenSearch = new opensearch.CfnCollection(this, 'opensearch-collection', {
      name: collectionName,
      // the properties below are optional
      standbyReplicas: 'DISABLED',
      type: 'SEARCH',
    });

    this.OpenSearch.addDependency(cfnSecurityPolicy);
    this.OpenSearch.addDependency(cfnSecurityNetworkPolicy);

    // add lambda triggers to tables
    const principals = new CompositePrincipal(
      new ServicePrincipal('lambda.amazonaws.com'),
      new ServicePrincipal('dynamodb.amazonaws.com')
    );
    this.lambdaExecutionRole = new Role(this, 'BaseExecutionRole', {
      assumedBy: principals,
      roleName: `${this.stackName}-lambda-trigger-execution-role`,
    });

    const cwPolicyStatement = new PolicyStatement({
      sid: 'CloudwatchLogs',
      effect: Effect.ALLOW,
      actions: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents'
      ],
      resources: ['*']
    });

    const opensearchPolicyStatement = new PolicyStatement({
      sid: 'OpenSearchServerless',
      effect: Effect.ALLOW,
      actions: [
        'aoss:*',
      ],
      resources: ['*']
    });

    const eventSourcePlicyStatement = new PolicyStatement({
      sid: 'eventSource',
      effect: Effect.ALLOW,
      actions: [
        'lambda:CreateEventSourceMapping',
        'dynamodb:PutItem',
        'dynamodb:GetItem',
        'dynamodb:UpdateItem',
        'dynamodb:GetRecords',
        'dynamodb:GetShardIterator',
        'dynamodb:DescribeStream',
        'dynamodb:ListStreams',
        'dynamodb:BatchWriteItem',
        'dynamodb:BatchGetItem',
        'sqs:SendMessage',
        'sqs:ReceiveMessage',
        'sqs:DeleteMessage',
        'sqs:GetQueueAttributes',
        'sqs:ChangeMessageVisibility'
      ],
      resources: ['*']
    });

    this.lambdaExecutionRole.addToPolicy(cwPolicyStatement);
    this.lambdaExecutionRole.addToPolicy(opensearchPolicyStatement);
    this.lambdaExecutionRole.addToPolicy(eventSourcePlicyStatement);

    new aws_opensearchserverless.CfnAccessPolicy(this, 'opensearch-data-access-policy-dynamo-triggers', {
      name: 'example-data-access-dynamo',
      type: 'data',
      policy: `[{"Description":"Access for example lambda triggers role","Rules":[{"ResourceType":"index","Resource":["index/*/*"],"Permission":["aoss:*"]},
      {"ResourceType":"collection","Resource":["collection/${this.OpenSearch.name}"],"Permission":["aoss:*"]}],
      "Principal":["${this.lambdaExecutionRole?.roleArn}"]}]`
    })

    const customersTrigger = new Function(this, 'customers-dynamo-trigger', {
      code: Code.fromInline(`
        exports.handler = async (event) => {
          console.log("Event received:", JSON.stringify(event, null, 2));
          // Add your logic here
          return { statusCode: 200, body: "Success" };
        };
      `),
      functionName: 'example-ddb-customers-trigger',
        environment: {
          STAGE: process.env.ENVIRONMENT || 'development',
          osEndpoint: this.OpenSearch.attrCollectionEndpoint
        },
      runtime: Runtime.NODEJS_20_X,
      timeout: Duration.seconds(30),
      handler: 'index.handler',
      role: this.lambdaExecutionRole
    });

    this.Tables.CUSTOMERS_TABLE.grantStream(customersTrigger);
    customersTrigger.addEventSource(new DynamoEventSource(CUSTOMERS_TABLE, { 
      startingPosition: StartingPosition.LATEST,
      parallelizationFactor: 1,
      bisectBatchOnError: true,
      maxBatchingWindow: Duration.seconds(0),
      retryAttempts: 3,
  }));
  
  }
}