import { SSTConfig } from 'sst';
import { customerApiStack, customerCognitoStack } from './customerStack';
import { RemovalPolicy } from 'aws-cdk-lib';

export default {
  config(_input) {
    return {
      name: 'customer-backend',
      region: 'eu-south-1',
    };
  },
  stacks(app) {
    // if (app.stage !== "production") {
    app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
    // }
    // app.stack(orgResources).stack(storeBackend).stack(storeFrontend);
    app.stack(customerCognitoStack).stack(customerApiStack);
    // .stack(paymentApp)
    // .stack(customerCognitoStack)
    // .stack(customerApiStack);
    // .stack(storeCognitoStack)
    // .stack(storeApiStack)
    // .stack(driverCognitoStack)
    // .stack(driverApiStack)
    // .stack(managementCognitoStack)
    // .stack(managementApiStack)
    // .stack(adminCognitoStack)
    // .stack(adminApiStack)
    // .stack(libraryCognitoStack)
    // .stack(libraryApiStack);

    if (app.stage === 'development') {
      // currentStack.stack(customerApp);
      // .stack(driverApp)
      // .stack(libraryApp)
      // .stack(managementApp)
      // .stack(adminApp)
      // .stack(storeApp);
    }
  },
} satisfies SSTConfig;