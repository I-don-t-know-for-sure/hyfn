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
const pathToLambdas = "packages/admin-backend/lambdas/";
const localhost = "http://localhost:";
export function adminServerStack({ stack }: StackContext) {
  const { key, s3Bucket } = use(orgResources);
  const stage = getStage(stack.stage);

  const defaultFunction = new Function(stack, "admindefaultFunction", {
    handler:
      "packages/store-backend/lambdas/createStoreDocument/createStoreDocument.handler",
  });
  const api = new Api(stack, "adminBackend", {
    defaults: {
      function: {
        role: defaultFunction.role,
        environment: {
          kmsKeyARN: key.keyArn,
          // COGNITO_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId || "",
          // COGNITO_REGION: stack.region,
          // USER_POOL_ID: auth.userPoolId,
          // USER_POOL_CLIENT_ID: auth.userPoolClientId,
          // ///////////////////////////////////
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

export function adminClientStack({ stack }: StackContext) {
  const { authBucket, s3Bucket } = use(orgResources);
  const { site: paymentAppSite } = use(paymentApp);
  const { api } = use(adminServerStack);
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
        authBucket.bucketArn +
          "/private/${cognito-identity.amazonaws.com:sub}/*",
      ],
    }),
  ]);

  const site = new StaticSite(stack, "admin_app", {
    path: "./packages/admin",
    buildOutput: "dist",
    buildCommand: "yarn build",

    environment: {
      GENERATE_SOURCEMAP: "false",
      VITE_APP_BUCKET_URL: `https://${s3Bucket.bucketName}.s3.${stack.region}.amazonaws.com`,

      VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL:
        frConfig[stage].MOAMALAT_PAYMEN_GATEWAY_URL,
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
    adminSite: site.url || localhost + "3007",
  });
}
