import { SSTConfig } from "sst";

import { RemovalPolicy } from "aws-cdk-lib";
import { storeApiStack, storeCognitoStack } from "../../stacks/storeBackend";
import { storeApp } from "./deploymentStack";

export default {
  config(_input) {
    return {
      name: "store-client",
      region: "eu-south-1",
    };
  },
  stacks(app) {
    // if (app.stage !== "production") {
    app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
    // }
    // app.stack(orgResources).stack(storeBackend).stack(storeFrontend);
    app.stack(storeApp);
  },
} satisfies SSTConfig;
