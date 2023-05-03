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
const pathToLambdas = "./packages/product-library-backend/lambdas/";

const localhost = "http://localhost:";

export function libraryApiStack({ stack }: StackContext) {
  const { auth } = use(libraryCognitoStack);
  const { s3Bucket } = use(imagesBucketStack);
  const { key } = use(kmsStack);
  const keyArn = key.keyArn;
  const imagesBucketName = s3Bucket.bucketName;

  const stage = getStage(stack.stage);
  const defaultFunction = new Function(stack, "librarydefaultFunction", {
    handler:
      "./packages/Store-backend/lambdas/createStoreDocument/createStoreDocument.handler",
  });
  const api = new Api(stack, "libraryApi", {
    defaults: {
      function: {
        role: defaultFunction.role,
        environment: {
          kmsKeyARN: keyArn,
          ///////////////////////
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
      "POST /createProductInLibrary": {
        function: {
          handler: pathToLambdas + "createProduct/createProduct.handler",
        },
      },
      "POST /deleteProductInLibrary": {
        function: {
          handler: pathToLambdas + "deleteProduct/deleteProduct.handler",
        },
      },
      "POST /generateImageURL": {
        function: {
          handler: pathToLambdas + "generateImageURL/generateImageURL.handler",
        },
      },
      "POST /updateProductInLibrary": {
        function: {
          handler: pathToLambdas + "updateProduct/updateProduct.handler",
        },
      },
      "POST /getProductInLibrary": {
        function: { handler: pathToLambdas + "getProduct/getProduct.handler" },
      },
      "POST /getProductsInLibrary": {
        function: {
          handler: pathToLambdas + "getProducts/getProducts.handler",
        },
      },
      "POST /createCompanyDocument": {
        function: {
          handler:
            pathToLambdas +
            "createCompanyDocument/createCompanyDocument.handler",
        },
      },
      "POST /updateCompanyInfo": {
        function: {
          handler:
            pathToLambdas + "updateCompanyInfo/updateCompanyInfo.handler",
        },
      },
      "POST /getCompanyDocument": {
        function: {
          handler:
            pathToLambdas + "getCompanyDocument/getCompanyDocument.handler",
        },
      },
      "POST /createBrand": {
        function: {
          handler: pathToLambdas + "createBrand/createBrand.handler",
        },
      },
      "POST /updateBrand": {
        function: {
          handler: pathToLambdas + "updateBrand/updateBrand.handler",
        },
      },
      "POST /deleteBrand": {
        function: {
          handler: pathToLambdas + "deleteBrand/deleteBrand.handler",
        },
      },
      "POST /getBrand": {
        function: { handler: pathToLambdas + "getBrand/getBrand.handler" },
      },
      "POST /getBrands": {
        function: { handler: pathToLambdas + "getBrands/getBrands.handler" },
      },
      "POST /getBrandsForList": {
        function: {
          handler: pathToLambdas + "getBrandsForList/getBrands.handler",
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
  new CfnOutput(stack, "libraryApiUrl-" + stack.stage, {
    value: api.url || "",
    exportName: "libraryApiUrl-" + stack.stage, // export name
  });
  /////////////////////////////////////////////////////////////////////

  stack.addOutputs({
    ApiEndpoint: api.url,
    apiArn: api.httpApiArn,
    apiFunctionsRoleArn:
      api.getFunction("POST /getBrandsForList")?.role?.roleArn || "",
  });
  return {
    api,
  };
}

export function libraryCognitoStack({ stack }: StackContext) {
  const { authBucket } = use(authBucketStack);
  const authBucketArn = authBucket.bucketArn;

  const stage = getStage(stack.stage);
  // Create a Cognito User Pool and Identity Pool
  const auth = new Cognito(stack, "libraryAuth", {
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
  new CfnOutput(stack, "libraryCognitoIdentityPoolId-" + stack.stage, {
    value: auth.cognitoIdentityPoolId || "",
    exportName: "libraryCognitoIdentityPoolId-" + stack.stage, // export name
  });
  new CfnOutput(stack, "libraryCognitoRegion-" + stack.stage, {
    value: stack.region || "",
    exportName: "libraryCognitoRegion-" + stack.stage, // export name
  });
  new CfnOutput(stack, "libraryUserPoolId-" + stack.stage, {
    value: auth.userPoolId || "",
    exportName: "libraryUserPoolId-" + stack.stage, // export name
  });
  new CfnOutput(stack, "libraryUserPoolClientId-" + stack.stage, {
    value: auth.userPoolClientId || "",
    exportName: "libraryUserPoolClientId-" + stack.stage, // export name
  });

  stack.addOutputs({
    // managmentSite: site.url || localhost + "3003",
  });
  return { auth };
}
