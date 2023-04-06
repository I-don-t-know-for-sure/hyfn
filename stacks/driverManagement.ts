import {
  StackContext,
  Api,
  use,
  Function,
  StaticSite,
  Cognito,
} from "sst/constructs";

import * as iam from "aws-cdk-lib/aws-iam";

import { getStage } from "./getStage";
import { frConfig } from "../frEnvVaraibles";
import { config } from "../envVaraibles";

import { CfnOutput, Fn } from "aws-cdk-lib";
import { authBucketStack, imagesBucketStack, kmsStack } from "./resources";
const pathToLambdas = "./packages/driver-management-backend/lambdas/";

const localhost = "http://localhost:";

export function managementApiStack({ stack }: StackContext) {
  const { s3Bucket } = use(imagesBucketStack);
  const { key } = use(kmsStack);
  const keyArn = key.keyArn;
  const imagesBucketName = s3Bucket.bucketName;
  // const keyArn = Fn.importValue(`secretesKmsKey-${stack.stage}`);
  // const imagesBucketName = Fn.importValue(`imagesBucket-${stack.stage}`);
  const { auth } = use(managementCognitoStack);
  const stage = getStage(stack.stage);
  const defaultFunction = new Function(stack, "managementdefaultFunction", {
    handler:
      "./packages/Store-backend/lambdas/createStoreDocument/createStoreDocument.handler",
  });
  const api = new Api(stack, "managmentApi", {
    defaults: {
      function: {
        timeout: 30,
        role: defaultFunction.role,
        environment: {
          kmsKeyARN: keyArn,
          /////////////////////////////
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
  new CfnOutput(stack, "managementApiUrl-" + stack.stage, {
    value: api.url || "",
    exportName: "managementApiUrl-" + stack.stage, // export name
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

export function managementCognitoStack({ stack }: StackContext) {
  // const authBucketArn = Fn.importValue(`authBucketArn-${stack.stage}`);
  const { authBucket } = use(authBucketStack);
  const authBucketArn = authBucket.bucketArn;

  // const { site: paymentAppSite } = use(paymentApp);

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
        authBucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
      ],
    }),
  ]);

  new CfnOutput(stack, "managementCognitoIdentityPoolId-" + stack.stage, {
    value: auth.cognitoIdentityPoolId || "",
    exportName: "managementCognitoIdentityPoolId-" + stack.stage, // export name
  });
  new CfnOutput(stack, "managementCognitoRegion-" + stack.stage, {
    value: stack.region || "",
    exportName: "managementCognitoRegion-" + stack.stage, // export name
  });
  new CfnOutput(stack, "managementUserPoolId-" + stack.stage, {
    value: auth.userPoolId || "",
    exportName: "managementUserPoolId-" + stack.stage, // export name
  });
  new CfnOutput(stack, "managementUserPoolClientId-" + stack.stage, {
    value: auth.userPoolClientId || "",
    exportName: "managementUserPoolClientId-" + stack.stage, // export name
  });

  // const site = new StaticSite(stack, "management_app", {
  //   path: "./packages/driver-management",
  //   buildOutput: "dist",
  //   buildCommand: "yarn build",

  //   ...(stack.stage === "production"
  //     ? {
  //         customDomain: {
  //           domainName: "management.hyfn.xyz",
  //           domainAlias: "www.management.hyfn.xyz",
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
  //     VITE_APP_BASE_URL: api.url,
  //   },
  // });

  stack.addOutputs({
    // managmentSite: site.url || localhost + "3001",
  });
  return { auth };
}
