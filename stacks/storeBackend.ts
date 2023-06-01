import {
  StackContext,
  Api,
  use,
  Function,
  StaticSite,
  Cognito,
  EventBus,
  Queue,
} from "sst/constructs";

import * as iam from "aws-cdk-lib/aws-iam";
import { config } from "../envVaraibles";

import {
  localCardKey,
  driversManagement,
  getStage,
  storeUrl,
  transactions,
} from ".";
import { CfnOutput } from "aws-cdk-lib";
import { authBucketStack, imagesBucketStack, kmsStack } from "./resources";

const pathToLambdas = "./packages/Store-backend/lambdas/";
const pathToDriverManagementLambdas =
  "./packages/driver-management-backend/lambdas/";

const localhost = "http://localhost:";

export function storeApiStack({ stack }: StackContext) {
  const { auth } = use(storeCognitoStack);
  const { s3Bucket } = use(imagesBucketStack);
  const { key } = use(kmsStack);

  const keyArn = key.keyArn;
  const imagesBucketName = s3Bucket.bucketName;

  const stage = getStage(stack.stage);

  const defaultFunction = new Function(stack, "defaultFunction", {
    handler: "./packages/Store-backend/lambdas/createStoreDocument.handler",
  });
  const envVars = {
    kmsKeyARN: keyArn,
    //////////////////////////
    chat_gpt_api_key: config[stage].chat_gpt_api_key,

    MONGODB_CLUSTER_NAME: config[stage].MONGODB_CLUSTER_NAME,
    accessKeyId: config[stage].accessKeyId,
    bucketName: imagesBucketName,
    bucketArn: s3Bucket.bucketArn,
    groupId: config[stage].groupId,
    moalmlatDataService: config[stage].moalmlatDataService,
    userPoolId: auth.userPoolId,
    userPoolClientId: auth.userPoolClientId,
    mongoPrivetKey: config[stage].mongoPrivetKey,
    mongoPublicKey: config[stage].mongoPublicKey,
    region: stack.region,
    sadadURL: config[stage].sadadURL,
    secretKey: config[stage].secretKey,
    MerchantId: config[stage].MerchantId,
    TerminalId: config[stage].TerminalId,
    mongdbURLKey: config[stage].mongdbURLKey,

    sadadApiKey: config[stage].sadadApiKey,

    secretAccessKey: config[stage].secretAccessKey,

    //////////////////////////

    db_url: config[stage].db_url,
    //////////////////////////
    clientEmail: config[""]["firebaseAdminSDK-client_email"],
    projectId: config[""]["firebaseAdminSDK-project_id"],
    privateKey: config[""]["firebaseAdminSDK-private_key"],
  };
  const removeBackgrounds = new Function(stack, "removeBackgrounds", {
    handler: pathToLambdas + "setBackgroundWhite.handler",
    functionName: "setBackgroundWhite" + stack.stage,
    role: defaultFunction.role,
    timeout: 300,
    url: true,
    environment: {
      ...envVars,
    },
  });
  const generateDescription = new Function(stack, "generateDescription", {
    role: defaultFunction.role,
    timeout: 300,
    functionName: "generateProductDescription" + stack.stage,

    url: true,
    handler: pathToLambdas + "generateProductDescription.handler",
    environment: {
      ...envVars,
    },
  });

  const api = new Api(stack, "storeApi", {
    defaults: {
      function: {
        bind: [s3Bucket],
        role: defaultFunction.role,
        timeout: stack.stage === "development" ? 30 : 10,

        environment: {
          ...envVars,
          generateProductDescriptionUrl: generateDescription.url || "",

          removeBackgroundsURL: removeBackgrounds.url || "",
        },
      },
    },
    routes: {
      [storeUrl({ method: "POST", url: "getProducts" })]: {
        function: {
          handler: pathToLambdas + "getProducts.handler",
          // functionName: "getProducts" + stack.stage,
        },
      },
      "POST /generateDescriptionClient": {
        function: {
          handler: pathToLambdas + "generateDescriptionClient.handler",
          // functionName: "generateDescriptionClient" + stack.stage,
        },
      },

      "POST /stopAcceptingOrders": {
        function: {
          handler: pathToLambdas + "stopAcceptingOrders.handler",
          // functionName: "stopAcceptingOrders" + stack.stage,
        },
      },
      "POST /updateNotificationTokens": {
        function: {
          handler: pathToLambdas + "updateNotificationTokens.handler",
          // functionName:
          //   "updateNotificationTokens" + stack.stackName + stack.stage,
        },
      },

      "POST /addEmployee": {
        function: {
          handler: pathToLambdas + "addEmployee.handler",
          // functionName: "addEmployee" + stack.stage,
        },
      },
      "POST /updateSubscibtion": {
        function: {
          handler: pathToLambdas + "updateSubscibtion.handler",
          // functionName: "updateSubscibtion" + stack.stage,
        },
      },
      "POST /generateImageReaderPutUrl": {
        function: {
          handler: pathToLambdas + "generateImageReaderPutUrl.handler",
          // functionName: "generateImageReaderPutUrl" + stack.stage,
        },
      },
      "POST /removeAllProductsBackgrounds": {
        function: {
          handler: pathToLambdas + "removeAllProductsBackgrounds.handler",
          // functionName: "removeAllProductsBackgrounds" + stack.stage,
        },
      },

      "POST /setProductAsNotFound": {
        function: {
          handler: pathToLambdas + "setProductAsNotFound.handler",
        },
      },
      "POST /setProductAsPickedUp": {
        function: {
          handler: pathToLambdas + "setProductAsPickedUp.handler",
        },
      },
      "POST /updateLocalCardSettings": {
        function: {
          handler: pathToLambdas + "updateLocalCardSettings.handler",
        },
      },

      "POST /setOrderAsAccepted": {
        function: {
          handler: pathToLambdas + "setOrderAsAccepted.handler",
        },
      },
      // "POST /setOrderAsDelivered": {
      //   function: {
      //     handler: pathToLambdas + "setOrderAsDelivered.handler",
      //   },
      // },
      // "POST /getDriverInfo": {
      //   function: {
      //     handler: pathToLambdas + "getDriverInfo.handler",
      //   },
      // },

      "POST /setOrderAsReady": {
        function: {
          handler: pathToLambdas + "setOrderAsReady.handler",
        },
      },
      "POST /setOrderAsPreparing": {
        function: {
          handler: pathToLambdas + "setOrderAsPreparing.handler",
        },
      },

      "POST /createTransaction": {
        function: {
          handler: pathToLambdas + "createTransaction.handler",
        },
      },

      "POST /createCollection": {
        function: {
          handler: pathToLambdas + "createCollectionWithActive.handler",
        },
      },
      "POST /createStoreDocument": {
        function: {
          handler: pathToLambdas + "createStoreDocument.handler",
        },
      },
      "POST /createProduct": {
        function: {
          handler: pathToLambdas + "createProduct.handler",
        },
      },

      "POST /validateLocalCardTransaction": {
        function: {
          handler: pathToLambdas + "validateLocalCardTransaction.handler",
        },
      },
      "POST /deleteCollection": {
        function: {
          handler: pathToLambdas + "deleteCollection.handler",
        },
      },
      "POST /updateStoreOwnerInfo": {
        function: {
          handler: pathToLambdas + "updateStoreOwnerInfo.handler",
        },
      },
      "POST /updateStoreInfo": {
        function: {
          handler: pathToLambdas + "updateStoreInfo.handler",
        },
      },
      "POST /getAllCollections": {
        function: {
          handler: pathToLambdas + "getAllCollections.handler",
        },
      },
      "POST /getCollection": {
        function: {
          handler: pathToLambdas + "getCollection.handler",
        },
      },
      "POST /getActiveOrders": {
        function: {
          handler: pathToLambdas + "getActiveOrders.handler",
        },
      },
      "POST /updateCollection": {
        function: {
          handler: pathToLambdas + "updateCollection.handler",
        },
      },
      "POST /updateProduct": {
        function: {
          handler: pathToLambdas + "updateProduct.handler",
        },
      },
      "POST /getCollectionsForProduct": {
        function: {
          handler: pathToLambdas + "getCollectionsForProduct.handler",
        },
      },
      "POST /deleteProduct": {
        function: {
          handler: pathToLambdas + "deleteProduct.handler",
        },
      },
      "POST /getProduct": {
        function: { handler: pathToLambdas + "getProduct.handler" },
      },
      "POST /getStoreDocument": {
        function: {
          handler: pathToLambdas + "getStoreDocument.handler",
        },
      },
      "POST /updateProductState": {
        function: {
          handler: pathToLambdas + "updateProductState.handler",
        },
      },
      "POST /openAndCloseStore": {
        function: {
          handler: pathToLambdas + "openAndCloseStore.handler",
        },
      },
      "POST /updatePaymentSettings": {
        function: {
          handler: pathToLambdas + "updatePaymentSettings.handler",
        },
      },
      "POST /paySubscription": {
        function: {
          handler: pathToLambdas + "paySubscription.handler",
        },
      },
      "POST /getOrderHistory": {
        function: {
          handler: pathToLambdas + "getOrderHistory.handler",
        },
      },
      "POST /generateImageURL": {
        function: {
          handler: pathToLambdas + "generateImageURL.handler",
        },
      },
      "POST /rejectOrder": {
        function: {
          handler: pathToLambdas + "rejectOrder.handler",
        },
      },
      "POST /searchProducts": {
        function: {
          handler: pathToLambdas + "searchProducts.handler",
        },
      },
      "POST /bulkWrite": {
        function: { handler: pathToLambdas + "bulkWrite.handler" },
      },
      "POST /getCollectionProducts": {
        function: {
          handler: pathToLambdas + "getCollectionProducts.handler",
        },
      },
      "POST /getProductsForCollection": {
        function: {
          handler: pathToLambdas + "getProductsForCollection.handler",
        },
      },
      "POST /bulkUpdate": {
        function: { handler: pathToLambdas + "bulkUpdate.handler" },
      },
      "POST /updateOptions": {
        function: {
          handler: pathToLambdas + "updateOptions.handler",
        },
      },
      "POST /getProductsForBulkUpdate": {
        function: {
          handler: pathToLambdas + "getProductsForBulkUpdate.handler",
        },
      },
      "POST /duplicateProduct": {
        function: {
          handler: pathToLambdas + "duplicateProduct.handler",
        },
      },
      "POST  /getCollectionStoreFrontProducts": {
        function: {
          handler: pathToLambdas + "getCollectionStoreFrontProducts.handler",
        },
      },
      ...driversManagement,
      ...localCardKey,
      ...transactions,
    },
  });

  const permissions = new iam.PolicyStatement({
    actions: ["*"],
    effect: iam.Effect.ALLOW,
    resources: [`*`],
  });

  api.attachPermissions([permissions]);
  api.setCors({
    allowMethods: ["POST"],
    allowHeaders: ["Accept", "Content-Type", "Authorization"],
  });
  new CfnOutput(stack, "storeApiUrl-" + stack.stage, {
    value: api.url || "",
    exportName: "storeApiUrl-" + stack.stage, // export name
  });
  /////////////////////////////////////////////////////////////////////

  stack.addOutputs({
    ApiEndpoint: api.url,
    apiArn: api.httpApiArn,
    apiFunctionsRoleArn:
      api.getFunction("POST /getProductsForBulkUpdate")?.role?.roleArn || "",
  });
  return { api };
}

export function storeCognitoStack({ stack }: StackContext) {
  const { authBucket } = use(authBucketStack);
  const authBucketArn = authBucket.bucketArn;

  const auth = new Cognito(stack, "Auth", {
    login: ["email"],
    cdk: {
      userPool: {
        passwordPolicy: {
          minLength: 8,
          // requireLowercase: false,
          // requireUppercase: false,
          // requireDigits: false,
          // requireSymbols: false,
        },
      },
    },
  });
  auth.attachPermissionsForAuthUsers(stack, [
    // Allow access to the API
    // api,
    // Policy granting access to a specific folder in the bucket
    new iam.PolicyStatement({
      actions: ["s3:*"],
      effect: iam.Effect.ALLOW,
      resources: [
        authBucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
      ],
    }),
  ]);
  new CfnOutput(stack, "storeCognitoIdentityPoolId-" + stack.stage, {
    value: auth.cognitoIdentityPoolId || "",
    exportName: "storeCognitoIdentityPoolId-" + stack.stage, // export name
  });
  new CfnOutput(stack, "storeCognitoRegion-" + stack.stage, {
    value: stack.region || "",
    exportName: "storeCognitoRegion-" + stack.stage, // export name
  });
  new CfnOutput(stack, "storeUserPoolId-" + stack.stage, {
    value: auth.userPoolId || "",
    exportName: "storeUserPoolId-" + stack.stage, // export name
  });
  new CfnOutput(stack, "storeUserPoolClientId-" + stack.stage, {
    value: auth.userPoolClientId || "",
    exportName: "storeUserPoolClientId-" + stack.stage, // export name
  });

  stack.addOutputs({
    // storeSite: site.url || localhost + "3004",
    VITE_APP_COGNITO_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId || "",
    VITE_APP_COGNITO_REGION: stack.region,
    VITE_APP_USER_POOL_ID: auth.userPoolId,
    VITE_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
  });
  return { auth };
}
