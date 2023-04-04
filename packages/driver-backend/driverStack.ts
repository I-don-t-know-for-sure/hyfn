import { StackContext, Api, use, Function, StaticSite, Cognito } from 'sst/constructs';

import * as iam from 'aws-cdk-lib/aws-iam';

import { getStage } from '../../stacks/getStage';

import { config } from '../../envVaraibles';
// import { authBucketStack, imagesBucketStack, kmsStack } from "./resources";
import { CfnOutput, Fn } from 'aws-cdk-lib';
import { Construct } from 'constructs';

const pathToLambdas = '../driver-backend/lambdas/';

const localhost = 'http://localhost:';

export function driverApiStack({ stack }: StackContext) {
  // const { s3Bucket } = use(imagesBucketStack);
  // const { key } = use(kmsStack);
  const { auth } = use(driverCognitoStack);
  const stage = getStage(stack.stage);
  const defaultFunction = new Function(stack, 'driverdefaultFunction', {
    handler: '../Store-backend/lambdas/createStoreDocument/createStoreDocument.handler',
  });
  const keyArn = Fn.importValue(`secretesKmsKey-${stack.stage}`);
  const imagesBucketName = Fn.importValue(`imagesBucket-${stack.stage}`);
  const api = new Api(stack, 'driverApi', {
    defaults: {
      function: {
        role: defaultFunction.role,
        environment: {
          kmsKeyARN: keyArn,
          //////////////////
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
      'POST /findOrders': {
        function: { handler: pathToLambdas + 'findOrders/findOrders.handler' },
      },
      'POST /getProposals': {
        function: {
          handler: pathToLambdas + 'getProposals/getProposals.handler',
        },
      },
      'POST /createProposal': {
        function: {
          handler: pathToLambdas + 'createProposal/createProposal.handler',
        },
      },
      'POST /updateProposal': {
        function: {
          handler: pathToLambdas + 'updateProposal/updateProposal.handler',
        },
      },
      'POST /deleteProposal': {
        function: {
          handler: pathToLambdas + 'deleteProposal/deleteProposal.handler',
        },
      },
      'POST /setOrderAsDelivered': {
        function: {
          handler: pathToLambdas + 'setOrderAsDelivered/setOrderAsDelivered.handler',
        },
      },
      'POST /reportOrder': {
        function: {
          handler: pathToLambdas + 'reportOrder/reportOrder.handler',
        },
      },
      'POST /leaveOrder': {
        function: { handler: pathToLambdas + 'leaveOrder/leaveOrder.handler' },
      },
      'POST /takeOrder': {
        function: { handler: pathToLambdas + 'takeOrder/takeOrder.handler' },
      },
      'POST /getActiveOrder': {
        function: {
          handler: pathToLambdas + 'getActiveOrder/getActiveOrder.handler',
        },
      },
      'POST /setOrderAsPickedUp': {
        function: {
          handler: pathToLambdas + 'setOrderAsPickedUp/setOrderAsPickedUp.handler',
        },
      },

      'POST /payStore': {
        function: { handler: pathToLambdas + 'payStore/payStore.handler' },
      },
      'POST /setDeliveryFeePaid': {
        function: {
          handler: pathToLambdas + 'setDeliveryFeePaid/setDeliveryFeePaid.handler',
        },
      },
      'POST /confirmPickup': {
        function: {
          handler: pathToLambdas + 'confirmPickup/confirmPickup.handler',
        },
      },
      'POST /createDriverDocument': {
        function: {
          handler: pathToLambdas + 'createDriverDocument/createDriverDocument.handler',
        },
      },
      'POST /updateDriverDocument': {
        function: {
          handler: pathToLambdas + 'updateDriverDocument/updateDriverDocument.handler',
        },
      },
      'POST /getDriverDocument': {
        function: {
          handler: pathToLambdas + 'getDriverDocument/getDriverDocument.handler',
        },
      },

      'POST /getOrderHistory': {
        function: {
          handler: pathToLambdas + 'getOrderHistory/getOrderHistory.handler',
        },
      },
      'POST /generateImageUrl': {
        function: {
          handler: pathToLambdas + 'generateImageUrl/generateImageUrl.handler',
        },
      },
      /**
 * 
 *  "POST /generateImageUrl": {
        function: {handler: pathToLambdas + 'generateImageUrl/generateImageUrl.handler',}
        
        url: {
          cors: {
            allowedHeaders: ['Content-Type'],
            allowedMethods: ['POST'],
          },
        },
      },
      imageResizeTrigger: {
        handler: '.build/lambdas/imageResizeTrigger/imageResizeTrigger.handler',
        url: {
          cors: {
            allowedHeaders: ['Content-Type'],
            allowedMethods: ['POST'],
          },
        },
      },
 */
      // "POST /createStoreDocument":
      //   "packages/store-backend/lambdas/createStoreDocument/createStoreDocument.handler",
      // "POST /getStoreDocument":
      //   "packages/store-backend/lambdas/getStoreDocument/getStoreDocument.handler",
    },
  });
  const permissions = new iam.PolicyStatement({
    actions: ['*'],
    effect: iam.Effect.ALLOW,
    resources: [`*`],
  });

  api.attachPermissions([permissions]);
  api.setCors({
    allowMethods: ['POST'],
    allowHeaders: ['Accept', 'Content-Type', 'Authorization'],
  });
  new CfnOutput(stack, 'driverApiUrl-' + stack.stage, {
    value: api.url || '',
    exportName: 'driverApiUrl-' + stack.stage, // export name
  });
  /////////////////////////////////////////////////////////////////////

  stack.addOutputs({
    ApiEndpoint: api.url,
    apiArn: api.httpApiArn,
    apiFunctionsRoleArn: api.getFunction('POST /getDriverDocument')?.role?.roleArn || '',
  });
  return {
    api,
  };
}

export function driverCognitoStack({ stack }: StackContext) {
  const authBucketArn = Fn.importValue(`authBucketArn-${stack.stage}`);

  // const { site: paymentAppSite } = use(paymentApp);

  const stage = getStage(stack.stage);
  // Create a Cognito User Pool and Identity Pool
  const auth = new Cognito(stack, 'driverAuth', {
    login: ['email'],
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
      actions: ['s3:*'],
      effect: iam.Effect.ALLOW,
      resources: [authBucketArn + '/private/${cognito-identity.amazonaws.com:sub}/*'],
    }),
  ]);

  new CfnOutput(stack as any, 'driverCognitoIdentityPoolId-' + stack.stage, {
    value: auth.cognitoIdentityPoolId || '',
    exportName: 'driverCognitoIdentityPoolId-' + stack.stage, // export name
  });
  new CfnOutput(stack as any, 'driverCognitoRegion-' + stack.stage, {
    value: stack.region || '',
    exportName: 'driverCognitoRegion-' + stack.stage, // export name
  });
  new CfnOutput(stack, 'driverUserPoolId-' + stack.stage, {
    value: auth.userPoolId || '',
    exportName: 'driverUserPoolId-' + stack.stage, // export name
  });
  new CfnOutput(stack, 'driverUserPoolClientId-' + stack.stage, {
    value: auth.userPoolClientId || '',
    exportName: 'driverUserPoolClientId-' + stack.stage, // export name
  });

  // const site = new StaticSite(stack, "driverApp", {
  //   path: "./packages/delivery-driver",
  //   buildOutput: "dist",
  //   buildCommand: "yarn build",
  //   ...(stack.stage === "production"
  //     ? {
  //         customDomain: {
  //           domainName: "driver.hyfn.xyz",
  //           domainAlias: "www.driver.hyfn.xyz",
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
    // managmentSite: site.url || localhost + "3002",
  });
  return { auth };
}
