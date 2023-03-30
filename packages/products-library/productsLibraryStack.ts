import {
  StackContext,
  Api,
  use,
  Function,
  StaticSite,
  Cognito,
} from "sst/constructs";

import * as iam from "aws-cdk-lib/aws-iam";

import { getStage } from "../../stacks/getStage";
import { frConfig } from "../../frEnvVaraibles";
import { config } from "../../envVaraibles";

import { CfnOutput, Fn } from "aws-cdk-lib";
const pathToLambdas = "../product-library-backend/lambdas/";

const localhost = "http://localhost:";

export function libraryApiStack({ stack }: StackContext) {
  // const { s3Bucket } = use(imagesBucketStack);
  // const { key } = use(kmsStack);
  const { auth } = use(libraryCognitoStack);
  const keyArn = Fn.importValue(`secretesKmsKey-${stack.stage}`);
  const imagesBucketName = Fn.importValue(`imagesBucket-${stack.stage}`);
  const stage = getStage(stack.stage);
  const defaultFunction = new Function(stack, "librarydefaultFunction", {
    handler:
      "../Store-backend/lambdas/createStoreDocument/createStoreDocument.handler",
  });
  const api = new Api(stack, "libraryBackend", {
    defaults: {
      function: {
        role: defaultFunction.role,
        environment: {
          kmsKeyARN: keyArn,
          ///////////////////////
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
  // const { s3Bucket } = use(imagesBucketStack);
  // const { authBucket } = use(authBucketStack);
  const authBucketArn = Fn.importValue(`authBucketArn-${stack.stage}`);
  const authBucketName = Fn.importValue(`authBucketName-${stack.stage}`);
  // const { site: paymentAppSite } = use(paymentApp);
  // const { api } = use(libraryB);
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
  // const site = new StaticSite(stack, "libraryapp", {
  //   path: "./packages/products-library",
  //   buildOutput: "dist",
  //   buildCommand: "yarn build",
  //   ...(stack.stage === "production"
  //     ? {
  //         customDomain: {
  //           domainName: "products.hyfn.xyz",
  //           domainAlias: "www.products.hyfn.xyz",
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
    // managmentSite: site.url || localhost + "3003",
  });
  return { auth };
}
