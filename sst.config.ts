import { SSTConfig } from "sst";

import { RemovalPolicy } from "aws-cdk-lib";
import { orgResources } from "./stacks/resources";
import { storeBackend, storeFrontend } from "./stacks/storeBackend";
import { paymentApp } from "./stacks/paymentAppStack";
import { customerBackend, customerFrontend } from "./stacks/customerStack";
import { driverBackend, driverFrontend } from "./stacks/driverStack";
import { libraryBackend, libraryFrontned } from "./stacks/productsLibraryStack";
import {
  managementBackend,
  managementFrontend,
} from "./stacks/driverManagement";
import { adminClientStack, adminServerStack } from "./stacks/adminStack";

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
    app
      .stack(orgResources)
      .stack(paymentApp)
      .stack(customerBackend)
      .stack(customerFrontend)
      .stack(storeBackend)
      .stack(storeFrontend)
      .stack(driverBackend)
      .stack(driverFrontend)
      .stack(libraryBackend)
      .stack(libraryFrontned)
      .stack(managementBackend)
      .stack(managementFrontend)
      .stack(adminServerStack)
      .stack(adminClientStack);
  },
} satisfies SSTConfig;
