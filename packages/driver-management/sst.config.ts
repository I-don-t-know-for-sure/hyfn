import { SSTConfig } from "sst";

import { RemovalPolicy } from "aws-cdk-lib";
import { managementApp } from "./deploymentStack";
import {
  managementApiStack,
  managementCognitoStack,
} from "../../stacks/driverManagement";

export default {
  config(_input) {
    return {
      name: "managment-client",
      region: _input.stage === "development" ? "eu-west-3" : "eu-south-1",
    };
  },
  stacks(app) {
    // if (app.stage !== "production") {
    app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
    // }
    // app.stack(orgResources).stack(storeBackend).stack(storeFrontend);
    app.stack(managementApp);
  },
} satisfies SSTConfig;
