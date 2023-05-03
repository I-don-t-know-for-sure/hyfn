import { SSTConfig } from "sst";

import { RemovalPolicy } from "aws-cdk-lib";
import {
  authBucketStack,
  imagesBucketStack,
  kmsStack,
} from "./stacks/resources";
import { customerApiStack, customerCognitoStack } from "./stacks/customerStack";
import { adminApiStack, adminCognitoStack } from "./stacks/adminStack";
import {
  managementApiStack,
  managementCognitoStack,
} from "./stacks/driverManagement";
import { driverApiStack, driverCognitoStack } from "./stacks/driverStack";
import {
  libraryApiStack,
  libraryCognitoStack,
} from "./stacks/productsLibraryStack";
import { storeApiStack, storeCognitoStack } from "./stacks/storeBackend";

export default {
  config(_input) {
    return {
      name: "hyfn-backend",
      region: "eu-south-1",
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
      .stack(storeApiStack);
    // .stack(customerCognitoStack)
    // .stack(customerApiStack)
    // .stack(adminCognitoStack)
    // .stack(adminApiStack)
    // .stack(managementCognitoStack)
    // .stack(managementApiStack)
    // .stack(driverCognitoStack)
    // .stack(driverApiStack);
    // .stack(libraryCognitoStack)
    // .stack(libraryApiStack)
  },
} satisfies SSTConfig;
