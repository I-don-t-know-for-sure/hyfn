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

import { config } from "../envVaraibles";

import { CfnOutput, Fn } from "aws-cdk-lib";
const pathToLambdas = "../../packages/admin-backend/lambdas/";

const localhost = "http://localhost:";
export function adminApiStack({ stack }: StackContext) {
  // const { s3Bucket } = use(imagesBucketStack);
  // const { key } = use(kmsStack);
  const keyArn = Fn.importValue(`secretesKmsKey-${stack.stage}`);
  const imagesBucketName = Fn.importValue(`imagesBucket-${stack.stage}`);
  const stage = getStage(stack.stage);

  const defaultFunction = new Function(stack, "admindefaultFunction", {
    handler:
      "../Store-backend/lambdas/createStoreDocument/createStoreDocument.handler",
  });
  const api = new Api(stack, "adminBackend", {
    defaults: {
      function: {
        role: defaultFunction.role,
        environment: {
          kmsKeyARN: keyArn,
          // COGNITO_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId || "",
          // COGNITO_REGION: stack.region,
          // USER_POOL_ID: auth.userPoolId,
          // USER_POOL_CLIENT_ID: auth.userPoolClientId,
          // ///////////////////////////////////
          MONGODB_CLUSTER_NAME: config[stage].MONGODB_CLUSTER_NAME,
          accessKeyId: config[stage].accessKeyId,
          bucketName: imagesBucketName,
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
      "POST /createAdminDocument": {
        function: {
          handler:
            pathToLambdas + "createAdminDocument/createAdminDocument.handler",
        },
      },
      "POST /getPaymentRequests": {
        function: {
          handler:
            pathToLambdas + "getPaymentRequests/getPaymentRequests.handler",
        },
      },
      "POST /completePaymentRequest": {
        function: {
          handler:
            pathToLambdas +
            "completePaymentRequest/completePaymentRequest.handler",
        },
      },
      "POST /createPaymentRequestObject": {
        function: {
          handler:
            pathToLambdas +
            "createPaymentRequestObject/createPaymentRequestObject.handler",
        },
      },
      "POST /removeDriverManagementVerification": {
        function: {
          handler:
            pathToLambdas +
            "removeDriverManagementVerification/removeDriverManagementVerification.handler",
        },
      },
      "POST /verifyDriverManagement": {
        function: {
          handler:
            pathToLambdas +
            "verifyDriverManagement/verifyDriverManagement.handler",
        },
      },
      "POST /getDriverManagement": {
        function: {
          handler:
            pathToLambdas + "getDriverManagement/getDriverManagement.handler",
        },
      },
      "POST /getUnverifiedDrivers": {
        function: {
          handler:
            pathToLambdas + "getUnverifiedDrivers/getUnverifiedDrivers.handler",
        },
      },
      "POST /getReports": {
        function: { handler: pathToLambdas + "getReports/getReports.handler" },
      },
      "POST /getAdminDocument": {
        function: {
          handler: pathToLambdas + "getAdminDocument/getAdminDocument.handler",
        },
      },
      "POST /setDriverAsVerified": {
        function: {
          handler:
            pathToLambdas + "setDriverAsVerified/setDriverAsVerified.handler",
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
  // const { s3Bucket } = use(imagesBucketStack);
  // const { authBucket } = use(authBucketStack);
  const authBucketArn = Fn.importValue(`authBucketArn-${stack.stage}`);

  // const { site: paymentAppSite } = use(paymentApp);
  const { api } = use(adminApiStack);
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

  // const site = new StaticSite(stack, "admin_app", {
  //   path: "./packages/admin",
  //   buildOutput: "dist",
  //   buildCommand: "yarn build",

  //   environment: {
  //     GENERATE_SOURCEMAP: "false",
  //     VITE_APP_BUCKET_URL: `https://${s3Bucket.bucketName}.s3.${stack.region}.amazonaws.com`,

  //     VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL:
  //       frConfig[stage].MOAMALAT_PAYMEN_GATEWAY_URL,
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
    // adminSite: site.url || localhost + "3007",
  });
}
