import { SSTConfig } from "sst";

import { RemovalPolicy } from "aws-cdk-lib";
import { paymentApp } from "./paymentAppStack";

export default {
  config(_input) {
    return {
      name: "hyfn-payment",
      region: "eu-south-1",
    };
  },
  stacks(app) {
    // if (app.stage !== "production") {
    app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
    // }
    // app.stack(orgResources).stack(storeBackend).stack(storeFrontend);
    app.stack(paymentApp);
  },
} satisfies SSTConfig;
