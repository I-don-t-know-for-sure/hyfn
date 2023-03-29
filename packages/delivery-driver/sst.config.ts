import { SSTConfig } from "sst";

import { RemovalPolicy } from "aws-cdk-lib";
import { driverApiStack, driverCognitoStack } from "./driverStack";

import { driverApp } from "./deploymentStack";

export default {
  config(_input) {
    return {
      name: "driver-app",
      region: "eu-south-1",
    };
  },
  stacks(app) {
    // if (app.stage !== "production") {
    app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
    // }
    // app.stack(orgResources).stack(storeBackend).stack(storeFrontend);
    app.stack(driverCognitoStack).stack(driverApiStack).stack(driverApp);
  },
} satisfies SSTConfig;
