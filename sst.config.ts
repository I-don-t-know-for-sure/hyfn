import { SSTConfig } from "sst";

import { RemovalPolicy } from "aws-cdk-lib";
import {
  authBucketStack,
  imagesBucketStack,
  kmsStack
} from "./stacks/resources";
import { customerApiStack, customerCognitoStack } from "./stacks/customerStack";
import { adminApiStack, adminCognitoStack } from "./stacks/adminStack";

import { storeApiStack, storeCognitoStack } from "./stacks/storeBackend";

export default {
  config(_input) {
    return {
      name: "hyfn-backend",
      region: _input.stage === "development" ? "eu-west-3" : "eu-south-1"
    };
  },
  stacks(app) {
    // if (app.stage !== "production") {
    app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
    // }
    // app.stack(orgResources).stack(storeBackend).stack(storeFrontend);
    app
      .stack(imagesBucketStack)
      .stack(authBucketStack)
      .stack(kmsStack)

      .stack(storeCognitoStack)
      .stack(storeApiStack)
      .stack(customerCognitoStack)
      .stack(customerApiStack)
      .stack(adminCognitoStack)
      .stack(adminApiStack);
  }
} satisfies SSTConfig;
