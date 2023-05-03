import {
  StackContext,
  Api,
  use,
  Function,
  StaticSite,
  Cognito,
} from "sst/constructs";

import * as iam from "aws-cdk-lib/aws-iam";

import { getStage } from "../stacks/getStage";

import { config } from "../envVaraibles";
// import { authBucketStack, imagesBucketStack, kmsStack } from "./resources";
import { CfnOutput, Fn } from "aws-cdk-lib";
import { Construct } from "constructs";
import { authBucketStack, imagesBucketStack, kmsStack } from "./resources";

const pathToLambdas = "./packages/driver-backend/lambdas/";

const localhost = "http://localhost:";

export function driverApiStack({ stack }: StackContext) {
  const { auth } = use(driverCognitoStack);
  const stage = getStage(stack.stage);
  const defaultFunction = new Function(stack, "driverdefaultFunction", {
    handler: "./packages/Store-backend/lambdas/createStoreDocument.handler",
  });
  const { s3Bucket } = use(imagesBucketStack);
  const { key } = use(kmsStack);
  const keyArn = key.keyArn;
  const imagesBucketName = s3Bucket.bucketName;

  const api = new Api(stack, "driverApi", {
    defaults: {
      function: {
        timeout: stack.stage === "development" ? 30 : 10,
        role: defaultFunction.role,
        environment: {
          kmsKeyARN: keyArn,
          //////////////////
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
        },
        permissions: [],
      },
    },
    routes: {
      "POST /getAvailableOrders": {
        function: { handler: pathToLambdas + "getAvailableOrders.handler" },
      },
      "POST /getProposals": {
        function: {
          handler: pathToLambdas + "getProposals.handler",
        },
      },
      "POST /updateNotificationTokens": {
        function: {
          handler: pathToLambdas + "updateNotificationTokens.handler",
        },
      },
      "POST /createProposal": {
        function: {
          handler: pathToLambdas + "createProposal.handler",
        },
      },
      "POST /updateProposal": {
        function: {
          handler: pathToLambdas + "updateProposal.handler",
        },
      },
      "POST /deleteProposal": {
        function: {
          handler: pathToLambdas + "deleteProposal.handler",
        },
      },
      "POST /setOrderAsDelivered": {
        function: {
          handler: pathToLambdas + "setOrderAsDelivered.handler",
        },
      },
      "POST /reportOrder": {
        function: {
          handler: pathToLambdas + "reportOrder.handler",
        },
      },
      "POST /leaveOrder": {
        function: { handler: pathToLambdas + "leaveOrder.handler" },
      },
      "POST /takeOrder": {
        function: { handler: pathToLambdas + "takeOrder.handler" },
      },
      "POST /getActiveOrders": {
        function: {
          handler: pathToLambdas + "getActiveOrders.handler",
        },
      },
      "POST /setOrderAsPickedUp": {
        function: {
          handler: pathToLambdas + "setOrderAsPickedUp.handler",
        },
      },

      "POST /setDeliveryFeePaid": {
        function: {
          handler: pathToLambdas + "setDeliveryFeePaid.handler",
        },
      },
      "POST /confirmPickup": {
        function: {
          handler: pathToLambdas + "confirmPickup.handler",
        },
      },
      "POST /createDriverDocument": {
        function: {
          handler: pathToLambdas + "createDriverDocument.handler",
        },
      },
      "POST /updateDriverDocument": {
        function: {
          handler: pathToLambdas + "updateDriverDocument.handler",
        },
      },
      "POST /getDriverDocument": {
        function: {
          handler: pathToLambdas + "getDriverDocument.handler",
        },
      },

      "POST /getOrderHistory": {
        function: {
          handler: pathToLambdas + "getOrderHistory.handler",
        },
      },
      "POST /generateImageUrl": {
        function: {
          handler: pathToLambdas + "generateImageUrl.handler",
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
  new CfnOutput(stack, "driverApiUrl-" + stack.stage, {
    value: api.url || "",
    exportName: "driverApiUrl-" + stack.stage, // export name
  });
  /////////////////////////////////////////////////////////////////////

  stack.addOutputs({
    ApiEndpoint: api.url,
    apiArn: api.httpApiArn,
    apiFunctionsRoleArn:
      api.getFunction("POST /getDriverDocument")?.role?.roleArn || "",
  });
  return {
    api,
  };
}

export function driverCognitoStack({ stack }: StackContext) {
  const { authBucket } = use(authBucketStack);
  const authBucketArn = authBucket.bucketArn;

  const stage = getStage(stack.stage);
  // Create a Cognito User Pool and Identity Pool
  const auth = new Cognito(stack, "driverAuth", {
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

  new CfnOutput(stack as any, "driverCognitoIdentityPoolId-" + stack.stage, {
    value: auth.cognitoIdentityPoolId || "",
    exportName: "driverCognitoIdentityPoolId-" + stack.stage, // export name
  });
  new CfnOutput(stack as any, "driverCognitoRegion-" + stack.stage, {
    value: stack.region || "",
    exportName: "driverCognitoRegion-" + stack.stage, // export name
  });
  new CfnOutput(stack, "driverUserPoolId-" + stack.stage, {
    value: auth.userPoolId || "",
    exportName: "driverUserPoolId-" + stack.stage, // export name
  });
  new CfnOutput(stack, "driverUserPoolClientId-" + stack.stage, {
    value: auth.userPoolClientId || "",
    exportName: "driverUserPoolClientId-" + stack.stage, // export name
  });

  stack.addOutputs({
    // managmentSite: site.url || localhost + "3002",
  });
  return { auth };
}
