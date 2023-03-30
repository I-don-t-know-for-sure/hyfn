import { SSTConfig } from "sst";

import { RemovalPolicy } from "aws-cdk-lib";

import { customerApp } from "./deploymentStack";
import { customerApiStack, customerCognitoStack } from "./customerStack";

export default {
  config(_input) {
    return {
      name: "customer-app",
      region: "eu-south-1",
    };
  },
  stacks(app) {
    // if (app.stage !== "production") {
    app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
    // }
    // app.stack(orgResources).stack(storeBackend).stack(storeFrontend);
    app.stack(customerCognitoStack).stack(customerApiStack).stack(customerApp);
  },
} satisfies SSTConfig;
