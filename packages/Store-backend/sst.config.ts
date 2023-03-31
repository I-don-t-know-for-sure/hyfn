import { SSTConfig } from 'sst';
import { storeApiStack, storeCognitoStack } from './storeBackend';
import { RemovalPolicy } from 'aws-cdk-lib';

export default {
  config(_input) {
    return {
      name: 'store-backend',
      region: 'eu-south-1',
    };
  },
  stacks(app) {
    // if (app.stage !== "production") {
    app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
    // }

    app.stack(storeCognitoStack).stack(storeApiStack);
  },
} satisfies SSTConfig;
