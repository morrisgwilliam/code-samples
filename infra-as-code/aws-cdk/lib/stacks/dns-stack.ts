import { Stack, StackProps } from 'aws-cdk-lib';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone, IHostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

interface Props extends StackProps {
  domainName: string
}

export class DnsStack extends Stack {
  public HostedZone: IHostedZone
  public Certificate: Certificate
  constructor(app: Construct, id: string, { domainName }: Props) {
    super(app, id);

    let fullDomainName = domainName

    if(process.env.SUBDOMAIN_NAME) fullDomainName = process.env.SUBDOMAIN_NAME + '.' + fullDomainName

    // production hosted zone is created automatically by Route 53
    // when the domain is registered. It is easiest to look it up by name
    // and not provision it in the CDK.
    if(process.env.ENVIRONMENT === 'production') {
      if(!process.env.HOSTED_ZONE_ID) throw new Error('Missing required environment variable HOSTED_ZONE_ID')
      // this.HostedZone = HostedZone.fromHostedZoneId(this, 'hosted-zone', process.env.HOSTED_ZONE_ID);
      this.HostedZone = HostedZone.fromHostedZoneAttributes(this, 'hosted-zone', {
        hostedZoneId: process.env.HOSTED_ZONE_ID,
        zoneName: fullDomainName,
      });
    } else {
      this.HostedZone = new HostedZone(this, 'hosted-zone', {
        zoneName: fullDomainName,
      });
    }

    this.Certificate = new Certificate(this, 'certificate', {
      domainName: fullDomainName,
      subjectAlternativeNames: [`*.${fullDomainName}`],
      certificateName: 'Certificate for development subdomain.',
      validation: CertificateValidation.fromDns(this.HostedZone),
    });
  }
}