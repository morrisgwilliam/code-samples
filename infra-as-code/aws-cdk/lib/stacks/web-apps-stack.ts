import { Stack, RemovalPolicy, StackProps } from 'aws-cdk-lib';
import {
OriginAccessIdentity,
CloudFrontWebDistribution,
PriceClass,
SSLMethod,
SecurityPolicyProtocol,
ViewerProtocolPolicy
} from 'aws-cdk-lib/aws-cloudfront';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { IHostedZone, ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Bucket, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

interface Props extends StackProps {
  zone: IHostedZone,
  certificate: Certificate
  domainName: string
}

export class WebAppStack extends Stack {
  constructor(app: Construct, id: string, {zone, certificate, domainName}: Props) {
    super(app, id);
    if(!process.env.DOMAIN_NAME) return
    let fullDomainName = domainName

    if(process.env.SUBDOMAIN_NAME) fullDomainName = process.env.SUBDOMAIN_NAME + '.' + fullDomainName


    const originAccessIdentityBusinessWebBucket = new OriginAccessIdentity(this, 'platform-web-app-origin-access-identity');

    const platformWebBucket = new Bucket(this, 'Bucket', {
      bucketName: `example-${process.env.ENVIRONMENT}-platform-web-app`,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: process.env.ENVIRONMENT === 'development' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN
    });

    platformWebBucket.grantRead(originAccessIdentityBusinessWebBucket);

    const platformCDN = new CloudFrontWebDistribution(this, 'platform-web-cdn', {
      priceClass: PriceClass.PRICE_CLASS_100,
      defaultRootObject: 'index.html',
      comment: 'This serves the business facing web app for ',
      viewerCertificate: {
        aliases: [fullDomainName],
        props: {
          acmCertificateArn: certificate.certificateArn,
          sslSupportMethod: SSLMethod.SNI,
          minimumProtocolVersion:
          SecurityPolicyProtocol.TLS_V1_2_2019,
        },
      },
      errorConfigurations: [
        {
          errorCode: 400,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
        {
          errorCode: 403,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
        {
          errorCode: 404,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
      ],
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: platformWebBucket,
            originAccessIdentity: originAccessIdentityBusinessWebBucket,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              viewerProtocolPolicy:
                  ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
          ],
        },
      ],
    });
    
    new ARecord(this, 'example-platform-a-record', {
      zone: zone,
      target: RecordTarget.fromAlias(
        new CloudFrontTarget(platformCDN)
      ),
      recordName: fullDomainName,
      comment: 'Domain name mapped to cloudfront for example platform web app.',
    });
    new BucketDeployment(this, 'deploy-platform-web-app', {
      sources: [],
      destinationBucket: platformWebBucket,
      distribution: platformCDN,
      distributionPaths: ['/*'],
    });
  }
}