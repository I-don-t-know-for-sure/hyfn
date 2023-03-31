import { SSTConfig } from "sst";

import { RemovalPolicy } from "aws-cdk-lib";

import { adminApp } from "./deploymentStack";
import { adminApiStack, adminCognitoStack } from "../admin-backend/adminStack";

export default {
  config(_input) {
    return {
      name: "admin-client",
      region: "eu-south-1",
    };
  },

  stacks(app) {
    // if (app.stage !== "production") {
    app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
    // }
    // app.stack(orgResources).stack(storeBackend).stack(storeFrontend);
    app.stack(adminApp);
  },
} satisfies SSTConfig;
