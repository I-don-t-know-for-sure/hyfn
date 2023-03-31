import { SSTConfig } from "sst";

import { RemovalPolicy } from "aws-cdk-lib";
import { libraryApp } from "./deploymentStack";
import {
  libraryApiStack,
  libraryCognitoStack,
} from "../product-library-backend/productsLibraryStack";

export default {
  config(_input) {
    return {
      name: "hyfn-library",
      region: "eu-south-1",
    };
  },
  stacks(app) {
    // if (app.stage !== "production") {
    app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
    // }
    // app.stack(orgResources).stack(storeBackend).stack(storeFrontend);
    app.stack(libraryApp);
  },
} satisfies SSTConfig;