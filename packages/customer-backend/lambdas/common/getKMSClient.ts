interface GetKMSClientProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
import { KMS } from 'aws-sdk';
export const kmsClient = new KMS();
