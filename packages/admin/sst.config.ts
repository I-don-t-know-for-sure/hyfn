import { SSTConfig } from "sst";

import { RemovalPolicy } from "aws-cdk-lib";
import { adminApiStack, adminCognitoStack } from "./adminStack";
import { adminApp } from "./deploymentStack";

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
    app.stack(adminCognitoStack).stack(adminApiStack).stack(adminApp);
  },
} satisfies SSTConfig;
