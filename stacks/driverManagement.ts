import {
  StackContext,
  Api,
  use,
  Function,
  StaticSite,
  Cognito,
} from "sst/constructs";
import { orgResources } from "./resources";
import * as iam from "aws-cdk-lib/aws-iam";
import { paymentApp } from "./paymentAppStack";
import { getStage } from "./getStage";
import { frConfig } from "../frEnvVaraibles";
import { config } from "../envVaraibles";
const pathToLambdas = "packages/driver-management-backend/lambdas/";
const localhost = "http://localhost:";

export function managementBackend({ stack }: StackContext) {
  const { key, s3Bucket } = use(orgResources);
  const stage = getStage(stack.stage);
  const defaultFunction = new Function(stack, "managementdefaultFunction", {
    handler:
      "packages/store-backend/lambdas/createStoreDocument/createStoreDocument.handler",
  });
  const api = new Api(stack, "managmentBackend", {
    defaults: {
      function: {
        timeout: 30,
        role: defaultFunction.role,
        environment: {
          kmsKeyARN: key.keyArn,
          /////////////////////////////
          MONGODB_CLUSTER_NAME: config[stage].MONGODB_CLUSTER_NAME,
          accessKeyId: config[stage].accessKeyId,
          bucketName: s3Bucket.bucketName,
          groupId: config[stage].groupId,
          moalmlatDataService: config[stage].moalmlatDataService,

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
      "POST /addLocalCardKeys": {
        function: {
          handler: pathToLambdas + "addLocalCardKeys/addLocalCardKeys.handler",
        },
      },
      "POST /getPaymentRequests": {
        function: {
          handler:
            pathToLambdas + "getPaymentRequests/getPaymentRequests.handler",
        },
      },
      "POST /cancelPaymentRequest": {
        function: {
          handler:
            pathToLambdas + "cancelPaymentRequest/cancelPaymentRequest.handler",
        },
      },
      "POST /createPaymentRequest": {
        function: {
          handler:
            pathToLambdas + "createPaymentRequest/createPaymentRequest.handler",
        },
      },
      "POST /DisableLocalCardKeys": {
        function: {
          handler:
            pathToLambdas + "DisableLocalCardKeys/DisableLocalCardKeys.handler",
        },
      },
      "POST /reportOrder": {
        function: {
          handler: pathToLambdas + "reportOrder/reportOrder.handler",
        },
      },
      "POST /searchDriverById": {
        function: {
          handler: pathToLambdas + "searchDriverById/searchDriverById.handler",
        },
      },
      "POST /getTrustedDrivers": {
        function: {
          handler:
            pathToLambdas + "getTrustedDrivers/getTrustedDrivers.handler",
        },
      },
      "POST /getManagement": {
        function: {
          handler: pathToLambdas + "getManagement/getManagement.handler",
        },
      },

      "POST /addToManagementDrivers": {
        function: {
          handler:
            pathToLambdas +
            "addDriverToManagementDrivers/addDriverToManagementDrivers.handler",
        },
      },
      "POST /createManagement": {
        function: {
          handler: pathToLambdas + "createManagement/createManagement.handler",
        },
      },
      "POST /getActiveOrders": {
        function: {
          handler: pathToLambdas + "getActiveOrders/getActiveOrders.handler",
        },
      },
      "POST /getDriverInfo": {
        function: {
          handler: pathToLambdas + "getDriverInfo/getDriverInfo.handler",
        },
      },
      "POST /getOrderHistory": {
        function: {
          handler: pathToLambdas + "getOrderHistory/getOrderHistory.handler",
        },
      },
      "POST /updateDriverBalance": {
        function: {
          handler:
            pathToLambdas + "updateDriverBalance/updateDriverBalance.handler",
        },
      },
      "POST /updateManagementInfo": {
        function: {
          handler:
            pathToLambdas + "updateManagementInfo/updateManagementInfo.handler",
        },
      },
      "POST /removeFromManagementDrivers": {
        function: {
          handler:
            pathToLambdas +
            "removeDriverFromManagementDrivers/removeDriverFromManagementDrivers.handler",
        },
      },
      "POST /createLocalCardTransaction": {
        function: {
          handler:
            pathToLambdas +
            "payWithLocalCard/createLocalCardTransaction.handler",
        },
      },
      "POST /getTransactionsList": {
        function: {
          handler:
            pathToLambdas + "payWithLocalCard/getTransactionsList.handler",
        },
      },
      "POST /validateLocalCardTransaction": {
        function: {
          handler:
            pathToLambdas +
            "payWithLocalCard/validateLocalCardTransaction.handler",
        },
      },
      "POST /{proxy+}": {
        function: {
          handler: pathToLambdas + "getManagement/getManagement.handler",
        },
      },
      // "POST /createStoreDocument":
      //   "packages/store-backend/lambdas/createStoreDocument/createStoreDocument.handler",
      // "POST /getStoreDocument":
      //   "packages/store-backend/lambdas/getStoreDocument/getStoreDocument.handler",
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

  /////////////////////////////////////////////////////////////////////

  stack.addOutputs({
    ApiEndpoint: api.url,
    apiArn: api.httpApiArn,
    apiFunctionsRoleArn:
      api.getFunction("POST /removeFromManagementDrivers")?.role?.roleArn || "",
  });
  return {
    api,
  };
}

export function managementFrontend({ stack }: StackContext) {
  const { authBucket, s3Bucket } = use(orgResources);
  const { site: paymentAppSite } = use(paymentApp);
  const { api } = use(managementBackend);
  const stage = getStage(stack.stage);
  // Create a Cognito User Pool and Identity Pool
  const auth = new Cognito(stack, "managementAuth", {
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
        authBucket.bucketArn +
          "/private/${cognito-identity.amazonaws.com:sub}/*",
      ],
    }),
  ]);

  const site = new StaticSite(stack, "management_app", {
    path: "./packages/driver-management",
    buildOutput: "dist",
    buildCommand: "yarn build",

    ...(stack.stage === "production"
      ? {
          customDomain: {
            domainName: "management.hyfn.xyz",
            domainAlias: "www.management.hyfn.xyz",
            hostedZone: "hyfn.xyz",
            // isExternalDomain: true,
          },
        }
      : {}),
    environment: {
      GENERATE_SOURCEMAP: "false",
      VITE_APP_BUCKET_URL: `https://${s3Bucket.bucketName}.s3.${stack.region}.amazonaws.com`,
      VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL:
        frConfig[stage].MOAMALAT_PAYMEN_GATEWAY_URL,
      // VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL=
      VITE_APP_PAYMENT_APP_URL: paymentAppSite.url || localhost + "3002",
      VITE_APP_COGNITO_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId || "",
      VITE_APP_COGNITO_REGION: stack.region,
      VITE_APP_USER_POOL_ID: auth.userPoolId,
      VITE_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
      VITE_APP_BUCKET: authBucket.bucketName,
      VITE_APP_BASE_URL: api.url,
    },
  });

  stack.addOutputs({
    managmentSite: site.url || localhost + "3001",
  });
}
