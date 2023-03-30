import { SSTConfig } from "sst";

import { RemovalPolicy } from "aws-cdk-lib";
import { storeApiStack, storeCognitoStack } from "./storeBackend";
import { storeApp } from "./deploymentStack";

export default {
  config(_input) {
    return {
      name: "hyfn-org",
      region: "eu-south-1",
    };
  },
  stacks(app) {
    // if (app.stage !== "production") {
    app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
    // }
    // app.stack(orgResources).stack(storeBackend).stack(storeFrontend);
    app.stack(storeCognitoStack).stack(storeApiStack).stack(storeApp);
  },
} satisfies SSTConfig;
