import * as cdk from 'aws-cdk-lib';
import {
Effect,
OpenIdConnectPrincipal,
OpenIdConnectProvider,
PolicyDocument,
PolicyStatement,
Role
} from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DevOpsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const githubOrganisation = '8Q-Solutions'
    // Change this to the repo you want to push code from
    const repoName = 'example'
    /**
     * Create an Identity provider for GitHub inside your AWS Account. This
     * allows GitHub to present itself to AWS IAM and assume a role.
     */
    const provider = new OpenIdConnectProvider(this, 'github-provider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
    });
    /**
     * Create a principal for the OpenID; which can allow it to assume
     * deployment roles.
     */
    const GitHubPrincipal = new OpenIdConnectPrincipal(provider).withConditions(
      {
        StringLike: {
          'token.actions.githubusercontent.com:sub':
            `repo:${githubOrganisation}/${repoName}:*`,
        },
      }
    );

    /**
  * Create a deployment role that has short lived credentials. The only
  * principal that can assume this role is the GitHub Open ID provider.
  *
  * This role is granted authority to assume aws cdk roles; which are created
  * by the aws cdk v2.
  */
    new Role(this, 'GitHubActionsRole', {
      assumedBy: GitHubPrincipal,
      description:
        'Role assumed by GitHubPrincipal for deploying from CI using aws cdk',
      roleName: 'github-ci-role',
      maxSessionDuration: cdk.Duration.hours(1),
      inlinePolicies: {
        CdkDeploymentPolicy: new PolicyDocument({
          assignSids: true,
          statements: [
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ['sts:AssumeRole'],
              resources: [`arn:aws:iam::${this.account}:role/cdk-*`],
            }),
          ],
        }),
      },
    });
  }
}
