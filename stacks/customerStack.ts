import {
  StackContext,
  Api,
  use,
  Function,
  StaticSite,
  Cognito,
} from "sst/constructs";

import * as iam from "aws-cdk-lib/aws-iam";
// import { paymentApp } from '../packages/payment-app/paymentAppStack';
import { getStage } from "../stacks/getStage";
import { frConfig } from "../frEnvVaraibles";
import { config } from "../envVaraibles";
// import { authBucketStack, imagesBucketStack, kmsStack } from './resources';
import { CfnOutput, Fn } from "aws-cdk-lib";
import { authBucketStack, imagesBucketStack, kmsStack } from "./resources";

const pathToLambdas = "./packages/customer-backend/lambdas/";
const localhost = "http://localhost:";

export function customerApiStack({ stack }: StackContext) {
  // const { key } = use(kmsStack);
  const { auth } = use(customerCognitoStack);

  const stage = getStage(stack.stage);

  const defaultFunction = new Function(stack, "customerdefaultFunction", {
    handler:
      "./packages/Store-backend/lambdas/createStoreDocument/createStoreDocument.handler",
  });
  const { s3Bucket } = use(imagesBucketStack);
  const { key } = use(kmsStack);
  const keyArn = key.keyArn;
  const imagesBucketName = s3Bucket.bucketName;
  // const keyArn = Fn.importValue(`secretesKmsKey-${stack.stage}`);
  // const imagesBucketName = Fn.importValue(`imagesBucket-${stack.stage}`);
  // const userPoolId = Fn.importValue(`customerUserPoolId-${stack.stage}`);
  // const userPoolClientId = Fn.importValue(
  //   `customerUserPoolClient-${stack.stage}`
  // );
  const api = new Api(stack, "customerApi", {
    defaults: {
      function: {
        timeout: 30,
        role: defaultFunction.role,
        environment: {
          kmsKeyARN: keyArn,
          // /////////////////
          // clientEmail: config[""]["firebaseAdminSDK-client_email"],
          // projectId: config[""]["firebaseAdminSDK-project_id"],
          // privateKey: config[""]["firebaseAdminSDK-private_key"],
          MONGODB_CLUSTER_NAME: config[stage].MONGODB_CLUSTER_NAME,
          accessKeyId: config[stage].accessKeyId,
          bucketName: imagesBucketName,
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
        },
        permissions: [],
      },
    },
    routes: {
      "POST /getStoreFronts": {
        function: {
          functionName: "getStoreFronts" + stack.stage,
          handler: pathToLambdas + "getStoreFronts/getStoreFronts.handler",
        },
      },
      "POST /cancelTransaction": {
        function: {
          functionName: "cancelTransaction" + stack.stage,
          handler:
            pathToLambdas + "cancelTransaction/cancelTransaction.handler",
        },
      },
      "POST /sendNotification": {
        function: {
          functionName: "sendNotification" + stack.stage,
          handler: pathToLambdas + "sendNotification/sendNotification.handler",
        },
      },
      "POST /updateNotificationTokens": {
        function: {
          functionName: "updateNotificationTokens" + stack.stage,
          handler:
            pathToLambdas +
            "updateNotificationTokens/updateNotificationTokens.handler",
        },
      },
      "POST /confirmPickup": {
        function: {
          functionName: "confirmPickup" + stack.stage,
          handler: pathToLambdas + "confirmPickup/confirmPickup.handler",
        },
      },
      "POST /acceptProposal": {
        function: {
          functionName: "acceptProposal" + stack.stage,
          handler: pathToLambdas + "acceptProposal/acceptProposal.handler",
        },
      },
      "POST /getCustomerData": {
        function: {
          functionName: "getCustomerData" + stack.stage,
          handler: pathToLambdas + "getCustomerData/getCustomerData.handler",
        },
      },
      "POST /createOrder": {
        function: {
          functionName: "createOrder" + stack.stage,
          handler: pathToLambdas + "createOrder/createOrder.handler",
        },
      },
      "POST /setOrderAsDelivered": {
        function: {
          functionName: "setOrderAsDelivered" + stack.stage,
          handler:
            pathToLambdas + "setOrderAsDelivered/setOrderAsDelivered.handler",
        },
      },
      "POST /getOrderDocument": {
        function: {
          functionName: "getOrderDocument" + stack.stage,
          handler: pathToLambdas + "getOrderDocument/getOrderDocument.handler",
        },
      },
      "POST /setProductAsNotFound": {
        function: {
          functionName: "setProductAsNotFound" + stack.stage,
          handler:
            pathToLambdas + "setProductAsNotFound/setProductAsNotFound.handler",
        },
      },
      "POST /setProductAsPickedUp": {
        function: {
          functionName: "setProductAsPickedUp" + stack.stage,
          handler:
            pathToLambdas + "setProductAsPickedUp/setProductAsPickedUp.handler",
        },
      },
      "POST /createOrderData": {
        function: {
          functionName: "createOrderData" + stack.stage,
          handler: pathToLambdas + "createOrderData/createOrderData.handler",
        },
      },
      "POST /getProduct": {
        function: {
          functionName: "getProduct" + stack.stage,
          handler: pathToLambdas + "getProduct/getProduct.handler",
        },
      },
      "POST /payServiceFee": {
        function: {
          functionName: "payServiceFee" + stack.stage,
          handler: pathToLambdas + "payServiceFee/payServiceFee.handler",
        },
      },
      "POST /getStoreFront": {
        function: {
          functionName: "getStoreFront" + stack.stage,
          handler: pathToLambdas + "getStoreFront/getStoreFront.handler",
        },
      },
      "POST /getActiveOrders": {
        function: {
          functionName: "getActiveOrders" + stack.stage,
          handler: pathToLambdas + "getActiveOrders/getActiveOrders.handler",
        },
      },
      "POST /getOrderHistory": {
        function: {
          functionName: "getOrderHistory" + stack.stage,
          handler: pathToLambdas + "getOrderHistory/getOrderHistory.handler",
        },
      },
      "POST /getCollectionProducts": {
        function: {
          functionName: "getCollectionProducts" + stack.stage,
          handler:
            pathToLambdas +
            "getCollectionProducts/getCollectionProducts.handler",
        },
      },
      "POST /getBalance": {
        function: {
          functionName: "getBalance" + stack.stage,
          handler: pathToLambdas + "getBalance/getBalance.handler",
        },
      },
      "POST /getDriverInfo": {
        function: {
          functionName: "getDriverInfo" + stack.stage,
          handler: pathToLambdas + "getDriverInfo/getDriverInfo.handler",
        },
      },
      "POST /createManagementLocalCardTransaction": {
        function: {
          functionName: "createManagementLocalCardTransaction" + stack.stage,

          handler:
            pathToLambdas +
            "PayManagementWithLcoalCard/createTransaction/createTransaction.handler",
        },
      },
      "POST /validateManagmentLocalCardTransaction": {
        functionName: "validateManagmentLocalCardTransaction" + stack.stage,
        function: {
          handler:
            pathToLambdas +
            "PayManagementWithLcoalCard/validateTransaction/validateTransaction.handler",
        },
      },
      "POST /createLocalCardTransaction": {
        function: {
          functionName: "createLocalCardTransaction" + stack.stage,
          handler:
            pathToLambdas +
            "payWithLocalCard/createLocalCardTransaction/createLocalCardTransaction.handler",
        },
      },
      "POST /createServiceFeeCardTransaction": {
        functionName: "createServiceFeeCardTransaction" + stack.stage,
        function: {
          handler:
            pathToLambdas +
            "payWithLocalCard/createServiceFeeCardTransaction/createServiceFeeCardTransaction.handler",
        },
      },
      "POST /cancelOrder": {
        function: {
          functionName: "cancelOrder" + stack.stage,
          handler: pathToLambdas + "cancelOrder/cancelOrder.handler",
        },
      },
      "POST /reportOrder": {
        function: {
          functionName: "reportOrder" + stack.stage,
          handler: pathToLambdas + "reportOrder/reportOrder.handler",
        },
      },
      "POST /createStoreLocalCardTransaction": {
        function: {
          functionName: "createStoreLocalCardTransaction" + stack.stage,
          handler:
            pathToLambdas +
            "payStoreWithLocalCard/createStoreLocalCardTransaction/createStoreLocalCardTransaction.handler",
        },
      },
      "POST /validateStoreLocalCardTransaction": {
        function: {
          functionName: "validateStoreLocalCardTransaction" + stack.stage,
          handler:
            pathToLambdas +
            "payStoreWithLocalCard/validateTransaction/validateTransaction.handler",
        },
      },
      "POST /getTransactionsList": {
        function: {
          functionName: "getTransactionsList" + stack.stage,
          handler:
            pathToLambdas +
            "payWithLocalCard/getTransactionsList/getTransactionsList.handler",
        },
      },
      "POST /validateLocalCardTransaction": {
        function: {
          functionName: "validateLocalCardTransaction" + stack.stage,
          handler:
            pathToLambdas +
            "payWithLocalCard/validateLocalCardTransaction/validateLocalCardTransaction.handler",
        },
      },
      "POST /createUserDocument": {
        function: {
          functionName: "createUserDocument" + stack.stage,
          handler:
            pathToLambdas + "createUserDocument/createUserDocument.handler",
        },
      },
      "POST /getTransactions": {
        function: {
          functionName: "getTransactions" + stack.stage,
          handler: pathToLambdas + "getTransactions/getTransactions.handler",
        },
      },
      "POST /updateUserDocument": {
        function: {
          functionName: "updateUserDocument" + stack.stage,
          handler:
            pathToLambdas + "updateUserDocument/updateUserDocument.handler",
        },
      },
      "POST /updateAddresses": {
        function: {
          functionName: "updateAddresses" + stack.stage,
          handler: pathToLambdas + "updateAddresses/updateAddresses.handler",
        },
      },
    },
    // routes: {
    //   "POST /createStoreDocument":
    //     "packages/store-backend/lambdas/createStoreDocument/createStoreDocument.handler",
    //   "POST /getStoreDocument":
    //     "packages/store-backend/lambdas/getStoreDocument/getStoreDocument.handler",
    // },
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
  new CfnOutput(stack, "customerApiUrl-" + stack.stage, {
    value: api.url || "",
    exportName: "customerApiUrl-" + stack.stage, // export name
  });
  /////////////////////////////////////////////////////////////////////

  stack.addOutputs({
    ApiEndpoint: api.url,
    apiArn: api.httpApiArn,
    apiFunctionsRoleArn:
      api.getFunction("POST /updateAddresses")?.role?.roleArn || "",
  });
  return { api };
}

export function customerCognitoStack({ stack }: StackContext) {
  // Create a Cognito User Pool and Identity Pool
  const auth = new Cognito(stack, "customerAuth", {
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
  const { authBucket } = use(authBucketStack);
  const authBucketArn = authBucket.bucketArn;
  // const authBucketArn = Fn.importValue(`authBucketArn-${stack.stage}`);
  // const authBucketName = Fn.importValue(`authBucketName-${stack.stage}`);

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

  new CfnOutput(stack, "customerCognitoIdentityPoolId-" + stack.stage, {
    value: auth.cognitoIdentityPoolId || "test",
    exportName: "customerCognitoIdentityPoolId-" + stack.stage, // export name
  });
  new CfnOutput(stack, "customerCognitoRegion-" + stack.stage, {
    value: stack.region || "",
    exportName: "customerCognitoRegion-" + stack.stage, // export name
  });
  new CfnOutput(stack, "customerUserPoolId-" + stack.stage, {
    value: auth.userPoolId || "",
    exportName: "customerUserPoolId-" + stack.stage, // export name
  });
  new CfnOutput(stack, "customerUserPoolClientId-" + stack.stage, {
    value: auth.userPoolClientId || "",
    exportName: "customerUserPoolClientId-" + stack.stage, // export name
  });
  return {
    auth,
  };
  // const site = new StaticSite(stack, "delivery-customer", {
  //   path: "./packages/delivery-customer",
  //   buildOutput: "dist",
  //   buildCommand: "yarn build",

  //   ...(stack.stage === "production"
  //     ? {
  //         customDomain: {
  //           domainName: "hyfn.xyz",
  //           domainAlias: "www.hyfn.xyz",
  //           hostedZone: "hyfn.xyz",
  //           // isExternalDomain: true,
  //         },
  //       }
  //     : {}),
  //   environment: {
  //     GENERATE_SOURCEMAP: "false",
  //     VITE_APP_BUCKET_URL: `https://${s3Bucket.bucketName}.s3.${stack.region}.amazonaws.com`,
  //     VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL:
  //       frConfig[stage].MOAMALAT_PAYMEN_GATEWAY_URL,
  //     // VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL=
  //     VITE_APP_PAYMENT_APP_URL: paymentAppSite.url || localhost + "3002",
  //     VITE_APP_COGNITO_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId || "",
  //     VITE_APP_COGNITO_REGION: stack.region,
  //     VITE_APP_USER_POOL_ID: auth.userPoolId,
  //     VITE_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
  //     VITE_APP_BUCKET: authBucket.bucketName,

  //     // VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL=

  //     VITE_APP_BASE_URL: api.url,
  //   },
  // });
  stack.addOutputs({
    // customerSite: site.url || localhost + "3000",
    // VITE_APP_PAYMENT_APP_URL: paymentAppSite.url || localhost + "3002",
    // VITE_APP_COGNITO_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId || "",
    // VITE_APP_COGNITO_REGION: stack.region,
    // VITE_APP_USER_POOL_ID: auth.userPoolId,
    // VITE_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
    // VITE_APP_BUCKET: authBucketName,
  });
}
