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

  const { auth } = use(managementCognitoStack);
  const stage = getStage(stack.stage);
  const defaultFunction = new Function(stack, "managementdefaultFunction", {
    handler: "./packages/Store-backend/lambdas/createStoreDocument.handler",
  });
  const api = new Api(stack, "managmentApi", {
    defaults: {
      function: {
        timeout: stack.stage === "development" ? 30 : 10,
        role: defaultFunction.role,
        environment: {
          kmsKeyARN: keyArn,
          /////////////////////////////
          clientEmail: config[""]["firebaseAdminSDK-client_email"],
          projectId: config[""]["firebaseAdminSDK-project_id"],
          privateKey: config[""]["firebaseAdminSDK-private_key"],
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
          db_url: config[stage].db_url,
        },
        permissions: [],
      },
    },

    routes: {
      "POST /addLocalCardKeys": {
        function: {
          handler: pathToLambdas + "addLocalCardKeys.handler",
        },
      },

      "POST /addEmployee": {
        function: {
          handler: pathToLambdas + "addEmployee.handler",
        },
      },
      "POST /getTransactions": {
        function: {
          handler: pathToLambdas + "getTransactions.handler",
        },
      },
      "POST /getAllDrivers": {
        function: {
          handler: pathToLambdas + "getAllDrivers.handler",
        },
      },
      "POST /replaceOrderDriver": {
        function: {
          handler: pathToLambdas + "replaceOrderDriver.handler",
        },
      },

      "POST /DisableLocalCardKeys": {
        function: {
          handler: pathToLambdas + "DisableLocalCardKeys.handler",
        },
      },
      "POST /reportOrder": {
        function: {
          handler: pathToLambdas + "reportOrder.handler",
        },
      },
      "POST /searchDriverById": {
        function: {
          handler: pathToLambdas + "searchDriverById.handler",
        },
      },
      "POST /getTrustedDrivers": {
        function: {
          handler: pathToLambdas + "getTrustedDrivers.handler",
        },
      },
      "POST /getManagement": {
        function: {
          handler: pathToLambdas + "getManagement.handler",
        },
      },

      "POST /addDriverToManagementDrivers": {
        function: {
          handler: pathToLambdas + "addDriverToManagementDrivers.handler",
        },
      },
      "POST /createManagement": {
        function: {
          handler: pathToLambdas + "createManagement.handler",
        },
      },
      "POST /getActiveOrders": {
        function: {
          handler: pathToLambdas + "getActiveOrders.handler",
        },
      },
      "POST /getDriverInfo": {
        function: {
          handler: pathToLambdas + "getDriverInfo.handler",
        },
      },
      "POST /getOrderHistory": {
        function: {
          handler: pathToLambdas + "getOrderHistory.handler",
        },
      },
      "POST /updateDriverBalance": {
        function: {
          handler: pathToLambdas + "updateDriverBalance.handler",
        },
      },
      "POST /updateManagementInfo": {
        function: {
          handler: pathToLambdas + "updateManagementInfo.handler",
        },
      },
      "POST /removeFromManagementDrivers": {
        function: {
          handler: pathToLambdas + "removeDriverFromManagementDrivers.handler",
        },
      },
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
  const { authBucket } = use(authBucketStack);
  const authBucketArn = authBucket.bucketArn;

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

  stack.addOutputs({
    // managmentSite: site.url || localhost + "3001",
  });
  return { auth };
}
