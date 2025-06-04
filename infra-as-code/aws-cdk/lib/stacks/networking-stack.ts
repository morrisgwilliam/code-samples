import { Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class NetworkingStack extends Stack {
  public readonly vpc: ec2.Vpc;
  constructor(app: Construct, id: string, props: StackProps) {
    super(app, id, props);

    this.vpc = new ec2.Vpc(this, 'vpc', {
      vpcName: 'example-vpc',
      cidr: '10.0.0.0/16',
      natGateways: 0,
      maxAzs: 3,
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24
        },
        {
          name: 'private-isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24
        },
      ]
    });
  }
}