import {
Duration,
Stack,
StackProps,
aws_opensearchserverless
} from 'aws-cdk-lib';
import {
  AuthorizationType,
  Cors,
  DomainName,
  IntegrationConfig,
  LambdaIntegration,
  LambdaIntegrationOptions,
  LambdaRestApi,
  Method,
  MethodLoggingLevel,
  SecurityPolicy
} from 'aws-cdk-lib/aws-apigateway';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import {
CompositePrincipal,
Effect,
PolicyStatement,
Role,
ServicePrincipal
} from 'aws-cdk-lib/aws-iam';
import {
  CfnPermission,
Code,
Function,
IFunction,
Runtime
} from 'aws-cdk-lib/aws-lambda';
import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { IHostedZone, ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { ApiGatewayDomain } from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';

interface Props extends StackProps {
  zone: IHostedZone,
  certificate: Certificate
  domainName: string
  userPool: UserPool
  authenticatedRole: Role
  tables: ITable[]
  opensearch: aws_opensearchserverless.CfnCollection
}

export class ApiStack extends Stack {
    api: LambdaRestApi;
    public lambdaExecutionRole: Role | undefined;
    nodejsFunctionProps: NodejsFunctionProps | undefined;
    defaultLambda: IFunction;
  constructor(app: Construct, id: string, {zone, domainName, certificate, authenticatedRole, opensearch, tables}: Props) {
    super(app, id);

    this.bootstrapLambdas(opensearch);

    new aws_opensearchserverless.CfnAccessPolicy(this, 'opensearch-data-access-policy', {
      name: 'example-data-access-policy',
      type: 'data',
      policy: `[{"Description":"Access for example lambda role","Rules":[{"ResourceType":"index","Resource":["index/*/*"],"Permission":["aoss:*"]},
      {"ResourceType":"collection","Resource":["collection/${opensearch.name}"],"Permission":["aoss:*"]}],
      "Principal":["${this.lambdaExecutionRole?.roleArn}"]}]`
    })

    this.defaultLambda = new Function(this, 'api-template', {
      code: Code.fromInline(`
        exports.handler = async (event) => {
          console.log("Event received:", JSON.stringify(event, null, 2));
          // Add your logic here
          return { statusCode: 200, body: "Success" };
        };
      `),
      functionName: 'example-api-template',
        environment: {
          STAGE: process.env.ENVIRONMENT || 'development',
          osEndpoint: opensearch.attrCollectionEndpoint
        },
      runtime: Runtime.NODEJS_20_X,
      timeout: Duration.seconds(30),
      role: this.lambdaExecutionRole,
      handler: 'index.handler'
    });

    tables.forEach(table => {
      table.grantFullAccess(this.defaultLambda);
    });

    this.api = new LambdaRestApi(this, 'apigw', {
      handler: this.defaultLambda,
      proxy: false,
      restApiName: 'example-api',
      deployOptions: {
        loggingLevel: MethodLoggingLevel.OFF,
        stageName: process.env.ENVIRONMENT?.toLowerCase(),
      },
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ['*'],
      },
    });

    this.defaultLambda.addPermission(id + 'wildcard-invoke-perms', {
      action: 'lambda:InvokeFunction',
      principal: new ServicePrincipal('apigateway.amazonaws.com'),
      sourceArn: this.api.arnForExecuteApi()
  });

    authenticatedRole.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
          'execute-api:Invoke',
      ],
      resources: [this.api.arnForExecuteApi()],
    }));

    if(!process.env.DOMAIN_NAME) return
    let fullDomainName = domainName
    if(process.env.SUBDOMAIN_NAME) fullDomainName = process.env.SUBDOMAIN_NAME + '.' + fullDomainName

    fullDomainName = 'api.' + fullDomainName

    const apigwDomain = new DomainName(this, 'apigw-domain-name', {
      domainName: fullDomainName,
      certificate: certificate,
      securityPolicy: SecurityPolicy.TLS_1_2
    });

    apigwDomain.addBasePathMapping(this.api, {
      stage: this.api.deploymentStage,
      basePath: process.env.ENVIRONMENT?.toLowerCase()
    });
    
    new ARecord(this, 'example-platform-a-record', {
      zone: zone,
      target: RecordTarget.fromAlias(
        new ApiGatewayDomain(apigwDomain)
      ),
      recordName: fullDomainName,
      comment: 'Domain name mapped to example platform apigateway.',
    });

    this.registerLambdas();

  }

  bootstrapLambdas(opensearch: aws_opensearchserverless.CfnCollection) {
    const principals = new CompositePrincipal(
      new ServicePrincipal('lambda.amazonaws.com')
    );
    this.lambdaExecutionRole = new Role(this, 'BaseExecutionRole', {
      assumedBy: principals,
      roleName: `${this.stackName}-lambda-execution-role`,
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

    this.lambdaExecutionRole.addToPolicy(cwPolicyStatement);
    this.lambdaExecutionRole.addToPolicy(opensearchPolicyStatement);

    this.nodejsFunctionProps =  {
      environment: {
        STAGE: process.env.ENVIRONMENT || 'development',
        opensearchEndpoint: opensearch.attrCollectionEndpoint
      },
      runtime: Runtime.NODEJS_20_X,
      timeout: Duration.seconds(30),
      role: this.lambdaExecutionRole
    };
  }

  registerLambdas(){
    /* CUSTOMERS */
    const customersResource = this.api.root.addResource('customers');
    customersResource.addMethod('GET', new LambdaIntegration(this.defaultLambda), {
      authorizationType: AuthorizationType.IAM,
    });
    const customerIdResource = this.api.root.addResource('customerById', {});
    customerIdResource.addMethod('GET', new LambdaIntegration(this.defaultLambda), {
      authorizationType: AuthorizationType.IAM,
    });
    const customerCreateResource = this.api.root.addResource('createCustomer', {});
    customerCreateResource.addMethod('POST', new LambdaIntegration(this.defaultLambda), {
      authorizationType: AuthorizationType.IAM,
    });
    
    const searchCustomersResource = this.api.root.addResource('searchCustomers', {});
    searchCustomersResource.addMethod('GET', new LambdaIntegration(this.defaultLambda), {
      authorizationType: AuthorizationType.IAM,
    });  

    const customerDeleteResource = this.api.root.addResource('deleteCustomer', {});
    customerDeleteResource.addMethod('POST', new LambdaIntegration(this.defaultLambda), {
      authorizationType: AuthorizationType.IAM,
    });

    const customerUpdateResource = this.api.root.addResource('updateCustomer', {});
    customerUpdateResource.addMethod('POST', new LambdaIntegration(this.defaultLambda), {
      authorizationType: AuthorizationType.IAM,
    });

  }
}
