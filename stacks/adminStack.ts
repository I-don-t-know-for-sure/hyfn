import {
  StackContext,
  Api,
  use,
  Function,
  StaticSite,
  Cognito,
} from "sst/constructs";

import * as iam from "aws-cdk-lib/aws-iam";

import { getStage } from ".";

import { config } from "../envVaraibles";

import { CfnOutput, Fn } from "aws-cdk-lib";
import { authBucketStack, imagesBucketStack, kmsStack } from "./resources";
const pathToLambdas = "./packages/admin-backend/lambdas/";

const localhost = "http://localhost:";
export function adminApiStack({ stack }: StackContext) {
  const { auth } = use(adminCognitoStack);

  const { s3Bucket } = use(imagesBucketStack);
  const { key } = use(kmsStack);
  const keyArn = key.keyArn;
  const imagesBucketName = s3Bucket.bucketName;

  const stage = getStage(stack.stage);

  const defaultFunction = new Function(stack, "admindefaultFunction", {
    handler: "./packages/Store-backend/lambdas/createStoreDocument.handler",
  });
  const api = new Api(stack, "adminApi", {
    defaults: {
      function: {
        timeout: stack.stage === "development" ? 30 : 10,
        role: defaultFunction.role,
        environment: {
          kmsKeyARN: keyArn,

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
      "POST /createAdminDocument": {
        function: {
          handler: pathToLambdas + "createAdminDocument.handler",
        },
      },
      "POST /getPaymentRequests": {
        function: {
          handler: pathToLambdas + "getPaymentRequests.handler",
        },
      },
      "POST /completePaymentRequest": {
        function: {
          handler: pathToLambdas + "completePaymentRequest.handler",
        },
      },
      "POST /createPaymentRequestObject": {
        function: {
          handler: pathToLambdas + "createPaymentRequestObject.handler",
        },
      },
      "POST /removeDriverManagementVerification": {
        function: {
          handler: pathToLambdas + "removeDriverManagementVerification.handler",
        },
      },
      "POST /verifyDriverManagement": {
        function: {
          handler: pathToLambdas + "verifyDriverManagement.handler",
        },
      },
      "POST /getDriverManagement": {
        function: {
          handler: pathToLambdas + "getDriverManagement.handler",
        },
      },
      "POST /getUnverifiedDrivers": {
        function: {
          handler: pathToLambdas + "getUnverifiedDrivers.handler",
        },
      },
      "POST /getReports": {
        function: { handler: pathToLambdas + "getReports.handler" },
      },
      "POST /getAdminDocument": {
        function: {
          handler: pathToLambdas + "getAdminDocument.handler",
        },
      },
      "POST /setDriverAsVerified": {
        function: {
          handler: pathToLambdas + "setDriverAsVerified.handler",
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
  new CfnOutput(stack, "adminApiUrl-" + stack.stage, {
    value: api.url || "",
    exportName: "adminApiUrl-" + stack.stage, // export name
  });
  /////////////////////////////////////////////////////////////////////

  stack.addOutputs({
    ApiEndpoint: api.url,
    apiArn: api.httpApiArn,
    apiFunctionsRoleArn:
      api.getFunction("POST /getAdminDocument")?.role?.roleArn || "",
  });
  return {
    api,
  };
}

export function adminCognitoStack({ stack }: StackContext) {
  const { authBucket } = use(authBucketStack);
  const authBucketArn = authBucket.bucketArn;

  const stage = getStage(stack.stage);

  const auth = new Cognito(stack, "adminAuth", {
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
    new iam.PolicyStatement({
      actions: ["s3:*"],
      effect: iam.Effect.ALLOW,
      resources: [
        authBucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
      ],
    }),
  ]);

  new CfnOutput(stack, "adminCognitoIdentityPoolId-" + stack.stage, {
    value: auth.cognitoIdentityPoolId || "",
    exportName: "adminCognitoIdentityPoolId-" + stack.stage, // export name
  });
  new CfnOutput(stack, "adminCognitoRegion-" + stack.stage, {
    value: stack.region || "",
    exportName: "adminCognitoRegion-" + stack.stage, // export name
  });
  new CfnOutput(stack, "adminUserPoolId-" + stack.stage, {
    value: auth.userPoolId || "",
    exportName: "adminUserPoolId-" + stack.stage, // export name
  });
  new CfnOutput(stack, "adminUserPoolClientId-" + stack.stage, {
    value: auth.userPoolClientId || "",
    exportName: "adminUserPoolClientId-" + stack.stage, // export name
  });

  stack.addOutputs({});
  return {
    auth,
  };
}
