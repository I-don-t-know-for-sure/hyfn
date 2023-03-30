import { SSTConfig } from "sst";

import { RemovalPolicy } from "aws-cdk-lib";
import {
  authBucketStack,
  imagesBucketStack,
  kmsStack,
} from "./stacks/resources";
import { paymentApp } from "./packages/payment-app/paymentAppStack";
import {
  customerApiStack,
  customerCognitoStack,
} from "./packages/delivery-customer/customerStack";
import { customerApp } from "./packages/delivery-customer/deploymentStack";
import {
  driverApiStack,
  driverCognitoStack,
} from "./packages/delivery-driver/driverStack";
import {
  managementApiStack,
  managementCognitoStack,
} from "./packages/driver-management/driverManagement";
import { adminApiStack, adminCognitoStack } from "./packages/admin/adminStack";
import {
  libraryApiStack,
  libraryCognitoStack,
} from "./packages/products-library/productsLibraryStack";
import {
  storeApiStack,
  storeCognitoStack,
} from "./packages/delivery-merchant/storeBackend";
import { driverApp } from "./packages/delivery-driver/deploymentStack";
import { libraryApp } from "./packages/products-library/deploymentStack";
import { managementApp } from "./packages/driver-management/deploymentStack";
import { adminApp } from "./packages/admin/deploymentStack";
import { storeApp } from "./packages/delivery-merchant/deploymentStack";

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
    let currentStack = app
      .stack(imagesBucketStack)
      .stack(authBucketStack)
      .stack(kmsStack);
    // .stack(paymentApp)
    // .stack(customerCognitoStack)
    // .stack(customerApiStack);
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
      // currentStack.stack(customerApp);
      // .stack(driverApp)
      // .stack(libraryApp)
      // .stack(managementApp)
      // .stack(adminApp)
      // .stack(storeApp);
    }
  },
} satisfies SSTConfig;
