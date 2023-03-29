import { SSTConfig } from "sst";

import { RemovalPolicy } from "aws-cdk-lib";
import {
  authBucketStack,
  imagesBucketStack,
  kmsStack,
} from "./stacks/resources";
import { paymentApp } from "./packages/payment-app/paymentAppStack";
import { customerApiStack, customerCognitoStack } from "./stacks/customerStack";
import { customerApp } from "./packages/delivery-customer/deploymentStack";
import { driverApiStack, driverCognitoStack } from "./stacks/driverStack";
import {
  managementApiStack,
  managementCognitoStack,
} from "./stacks/driverManagement";
import { adminApiStack, adminCognitoStack } from "./stacks/adminStack";
import {
  libraryApiStack,
  libraryCognitoStack,
} from "./stacks/productsLibraryStack";
import { storeApiStack, storeCognitoStack } from "./stacks/storeBackend";
import { driverApp } from "./packages/delivery-driver/deploymentStack";
import { libraryApp } from "./packages/products-library/deploymentStack";
import { managementApp } from "./packages/driver-management/deploymentStack";
import { adminApp } from "./packages/admin/deploymentStack";
import { storeApp } from "./packages/delivery-merchant/deploymentStack";

export default {
  config(_input) {
    return {
      name: "hyfn-apps",
      region: "eu-south-1",
    };
  },
  stacks(app) {
    // if (app.stage !== "production") {
    app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
    // }
    // app.stack(orgResources).stack(storeBackend).stack(storeFrontend);
    let currentStack = app
      .stack(imagesBucketStack)
      .stack(authBucketStack)
      .stack(kmsStack)
      .stack(paymentApp)
      .stack(customerCognitoStack)
      .stack(customerApiStack);
    // .stack(storeCognitoStack)
    // .stack(storeApiStack)
    // .stack(driverCognitoStack)
    // .stack(driverApiStack)
    // .stack(managementCognitoStack)
    // .stack(managementApiStack)
    // .stack(adminCognitoStack)
    // .stack(adminApiStack)
    // .stack(libraryCognitoStack)
    // .stack(libraryApiStack);

    if (app.stage === "development") {
      currentStack.stack(customerApp);
      // .stack(driverApp)
      // .stack(libraryApp)
      // .stack(managementApp)
      // .stack(adminApp)
      // .stack(storeApp);
    }
  },
} satisfies SSTConfig;
