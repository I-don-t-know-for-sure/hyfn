import { SSTConfig } from 'sst';

import { RemovalPolicy } from 'aws-cdk-lib';
import { managementApp } from './deploymentStack';
import { managementApiStack, managementCognitoStack } from './driverManagement';

export default {
  config(_input) {
    return {
      name: 'customer-app',
      region: 'eu-south-1',
    };
  },
  stacks(app) {
    // if (app.stage !== "production") {
    app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
    // }
    // app.stack(orgResources).stack(storeBackend).stack(storeFrontend);
    app.stack(managementCognitoStack).stack(managementApiStack).stack(managementApp);
  },
} satisfies SSTConfig;
