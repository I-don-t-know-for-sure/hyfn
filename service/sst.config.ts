import { SSTConfig } from "sst";

import { RemovalPolicy } from "aws-cdk-lib";

import { customerApp } from "../packages/delivery-customer/deploymentStack";

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
    app.stack(customerApp);
  },
} satisfies SSTConfig;
