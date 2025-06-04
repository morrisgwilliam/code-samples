import {
Duration,
RemovalPolicy,
Stack,
StackProps
} from 'aws-cdk-lib';
import {
  CfnIdentityPool,
  UserPool,
  UserPoolClient,
  CfnIdentityPoolRoleAttachment,
  AccountRecovery,
  UserPoolOperation,
} from 'aws-cdk-lib/aws-cognito';
import {
  Effect,
  FederatedPrincipal,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';

interface Props extends StackProps {
  teamsTable: ITable
}


export class CognitoStack extends Stack {
  userPool: UserPool;
  authenticatedRole: Role;
  // eslint-disable-next-line no-unused-vars
  constructor(app: Construct, id: string, props: Props) {
    super(app, id);

    this.userPool = new UserPool(this, 'example-userpool', {
      userPoolName: 'example-userpool',
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      selfSignUpEnabled: true,
      removalPolicy:
        process.env.ENVIRONMENT === 'development'
          ? RemovalPolicy.DESTROY
          : RemovalPolicy.RETAIN,
      autoVerify: {
        email: true,
      },
      passwordPolicy: {
        minLength: 6,
        requireUppercase: true,
        requireLowercase: true,
        requireDigits: true,
        requireSymbols: true,
        tempPasswordValidity: Duration.days(7),
      },
    });

    const userPoolClient = new UserPoolClient(
      this,
      'example-userpool-client',
      {
        generateSecret: false,
        userPool: this.userPool,
        userPoolClientName: 'example-userpool-client',
      }
    );
    const identityPool = new CfnIdentityPool(this, 'example-identity-pool', {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
        },
      ],
    });

    this.authenticatedRole = new Role(this, 'CognitoDefaultAuthenticatedRole', {
      roleName: `${this.region}-example-authenticated-role`,
      assumedBy: new FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': identityPool.ref,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'authenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity'
      ),
    });

    this.authenticatedRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          'mobileanalytics:PutEvents',
          'cognito-sync:*',
          'cognito-identity:*',
        ],
        resources: ['*'],
      })
    );

    new CfnIdentityPoolRoleAttachment(this, 'DefaultValid', {
      identityPoolId: identityPool.ref,
      roles: {
        authenticated: this.authenticatedRole.roleArn,
      },
    });

    // add post confirmation lambda trigger

    const postConfirmationTrigger = new Function(this, 'cognito-confirmation-trigger', {
      code: Code.fromInline(`
        exports.handler = async (event) => {
          console.log("Event received:", JSON.stringify(event, null, 2));
          // Add your logic here
          return { statusCode: 200, body: "Success" };
        };
      `),
      functionName: 'example-cognito-confirmation-trigger',
      environment: {
        STAGE: process.env.ENVIRONMENT || 'development',
      },
      runtime: Runtime.NODEJS_20_X,
      timeout: Duration.seconds(30),
      handler: 'index.handler',
    });

    const invokeCognitoTriggerPermission = {
      principal: new ServicePrincipal('cognito-idp.amazonaws.com'),
      sourceArn: this.userPool.userPoolArn,
    };

    postConfirmationTrigger.addPermission(
      'InvokePostConfirmationHandlerPermission',
      invokeCognitoTriggerPermission
    );

    props.teamsTable.grantFullAccess(postConfirmationTrigger);

    this.userPool.addTrigger(
      UserPoolOperation.POST_CONFIRMATION,
      postConfirmationTrigger
    );
  }
}
