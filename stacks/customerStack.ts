import {
  StackContext,
  Api,
  use,
  Function,
  StaticSite,
  Cognito
} from "sst/constructs";

import * as iam from "aws-cdk-lib/aws-iam";

import { customerUrl, getStage, transactions } from ".";

import { config } from "../envVaraibles";

import { CfnOutput, Fn } from "aws-cdk-lib";
import { authBucketStack, imagesBucketStack, kmsStack } from "./resources";

const pathToLambdas = "./packages/customer-backend/lambdas/";
const pathToStoreLambdas = "./packages/Store-backend/lambdas/";
export function customerApiStack({ stack }: StackContext) {
  // const { key } = use(kmsStack);
  const { auth } = use(customerCognitoStack);

  const stage = getStage(stack.stage);

  const defaultFunction = new Function(stack, "customerdefaultFunction", {
    handler: "./packages/Store-backend/lambdas/createStoreDocument.handler"
  });
  const { s3Bucket } = use(imagesBucketStack);
  const { key } = use(kmsStack);
  const keyArn = key.keyArn;
  const imagesBucketName = s3Bucket.bucketName;

  const api = new Api(stack, "customerApi", {
    defaults: {
      function: {
        timeout: stack.stage === "development" ? 30 : 10,
        role: defaultFunction.role,
        environment: {
          kmsKeyARN: keyArn,
          // /////////////////
          clientEmail: config[""]["firebaseAdminSDK-client_email"],
          projectId: config[""]["firebaseAdminSDK-project_id"],
          privateKey: config[""]["firebaseAdminSDK-private_key"],

          accessKeyId: config[stage].accessKeyId,
          bucketName: imagesBucketName,

          moalmlatDataService: config[stage].moalmlatDataService,
          userPoolId: auth.userPoolId,
          userPoolClientId: auth.userPoolClientId,

          region: stack.region,
          sadadURL: config[stage].sadadURL,
          secretKey: config[stage].secretKey,
          MerchantId: config[stage].MerchantId,
          TerminalId: config[stage].TerminalId,

          sadadApiKey: config[stage].sadadApiKey,

          secretAccessKey: config[stage].secretAccessKey,
          db_url: config[stage].db_url
        },
        permissions: []
      }
    },
    routes: {
      "POST /getStoreFronts": {
        function: {
          functionName: "getStoreFronts" + stack.stage,
          handler: pathToLambdas + "getStoreFronts.handler"
        }
      },

      "POST /createTransaction": {
        function: {
          handler: pathToLambdas + "createTransaction.handler",
          functionName: "createTransaction" + stack.stage
        }
      },

      "POST /validateTransaction": {
        function: {
          handler: pathToLambdas + "validateTransaction.handler",
          functionName: "validateTransaction" + stack.stage
        }
      },

      "POST /updateNotificationTokens": {
        function: {
          functionName: "updateNotificationTokens" + stack.stage,
          handler: pathToLambdas + "updateNotificationTokens.handler"
        }
      },
      "POST /confirmPickup": {
        function: {
          functionName: "confirmPickup" + stack.stage,
          handler: pathToLambdas + "confirmPickup.handler"
        }
      },
      "POST /acceptProposal": {
        function: {
          functionName: "acceptProposal" + stack.stage,
          handler: pathToLambdas + "acceptProposal.handler"
        }
      },
      "POST /getCustomerData": {
        function: {
          functionName: "getCustomerData" + stack.stage,
          handler: pathToLambdas + "getCustomerData.handler"
        }
      },

      "POST /setOrderAsDelivered": {
        function: {
          functionName: "setOrderAsDelivered" + stack.stage,
          handler: pathToLambdas + "setOrderAsDelivered.handler"
        }
      },

      "POST /setProductAsNotFound": {
        function: {
          functionName: "setProductAsNotFound" + stack.stage,
          handler: pathToLambdas + "setProductAsNotFound.handler"
        }
      },
      "POST /setProductAsPickedUp": {
        function: {
          functionName: "setProductAsPickedUp" + stack.stage,
          handler: pathToLambdas + "setProductAsPickedUp.handler"
        }
      },
      "POST /createOrderData": {
        function: {
          functionName: "createOrderData" + stack.stage,
          handler: pathToLambdas + "createOrderData.handler"
        }
      },
      "POST /getProduct": {
        function: {
          functionName: "getProduct" + stack.stage,
          handler: pathToLambdas + "getProduct.handler"
        }
      },

      "POST /getStoreFront": {
        function: {
          functionName: "getStoreFront" + stack.stage,
          handler: pathToLambdas + "getStoreFront.handler"
        }
      },
      "POST /getActiveOrders": {
        function: {
          functionName: "getActiveOrders" + stack.stage,
          handler: pathToLambdas + "getActiveOrders.handler"
        }
      },
      "POST /getOrderHistory": {
        function: {
          functionName: "getOrderHistory" + stack.stage,
          handler: pathToLambdas + "getOrderHistory.handler"
        }
      },
      "POST /getCollectionProducts": {
        function: {
          functionName: "getCollectionProducts" + stack.stage,
          handler: pathToLambdas + "getCollectionProducts.handler"
        }
      },
      "POST /getBalance": {
        function: {
          functionName: "getBalance" + stack.stage,
          handler: pathToLambdas + "getBalance.handler"
        }
      },

      "POST /cancelOrder": {
        function: {
          functionName: "cancelOrder" + stack.stage,
          handler: pathToLambdas + "cancelOrder.handler"
        }
      },
      "POST /reportOrder": {
        function: {
          functionName: "reportOrder" + stack.stage,
          handler: pathToLambdas + "reportOrder.handler"
        }
      },

      "POST /createUserDocument": {
        function: {
          functionName: "createUserDocument" + stack.stage,
          handler: pathToLambdas + "createUserDocument.handler"
        }
      },

      "POST /updateUserDocument": {
        function: {
          functionName: "updateUserDocument" + stack.stage,
          handler: pathToLambdas + "updateUserDocument.handler"
        }
      },
      "POST /updateAddresses": {
        function: {
          functionName: "updateAddresses" + stack.stage,
          handler: pathToLambdas + "updateAddresses.handler"
        }
      },
      [customerUrl({ method: "POST", url: "getOrder" })]: {
        function: {
          handler: pathToStoreLambdas + "getOrder.handler"
        }
      },
      [customerUrl({ method: "POST", url: "getSearchHits" })]: {
        function: {
          handler: pathToLambdas + "getSearchHits.handler"
        }
      },

      ...transactions
    }
  });
  const permissions = new iam.PolicyStatement({
    actions: ["*"],
    effect: iam.Effect.ALLOW,
    resources: [`*`]
  });

  api.attachPermissions([permissions]);
  api.setCors({
    allowMethods: ["POST"],
    allowHeaders: ["Accept", "Content-Type", "Authorization"]
  });
  new CfnOutput(stack, "customerApiUrl-" + stack.stage, {
    value: api.url || "",
    exportName: "customerApiUrl-" + stack.stage // export name
  });
  /////////////////////////////////////////////////////////////////////

  stack.addOutputs({
    ApiEndpoint: api.url,
    apiArn: api.httpApiArn,
    apiFunctionsRoleArn:
      api.getFunction("POST /updateAddresses")?.role?.roleArn || ""
  });
  return { api };
}

export function customerCognitoStack({ stack }: StackContext) {
  // Create a Cognito User Pool and Identity Pool
  const auth = new Cognito(stack, "customerAuth", {
    login: ["email"],
    cdk: {
      userPool: {
        passwordPolicy: {
          minLength: 8
          // requireLowercase: false,
          // requireUppercase: false,
          // requireDigits: false,
          // requireSymbols: false,
        }
      }
    }
  });
  const { authBucket } = use(authBucketStack);
  const authBucketArn = authBucket.bucketArn;

  auth.attachPermissionsForAuthUsers(stack, [
    // Allow access to the API
    // api,
    // Policy granting access to a specific folder in the bucket
    new iam.PolicyStatement({
      actions: ["s3:*"],
      effect: iam.Effect.ALLOW,
      resources: [
        authBucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*"
      ]
    })
  ]);

  new CfnOutput(stack, "customerCognitoIdentityPoolId-" + stack.stage, {
    value: auth.cognitoIdentityPoolId || "test",
    exportName: "customerCognitoIdentityPoolId-" + stack.stage // export name
  });
  new CfnOutput(stack, "customerCognitoRegion-" + stack.stage, {
    value: stack.region || "",
    exportName: "customerCognitoRegion-" + stack.stage // export name
  });
  new CfnOutput(stack, "customerUserPoolId-" + stack.stage, {
    value: auth.userPoolId || "",
    exportName: "customerUserPoolId-" + stack.stage // export name
  });
  new CfnOutput(stack, "customerUserPoolClientId-" + stack.stage, {
    value: auth.userPoolClientId || "",
    exportName: "customerUserPoolClientId-" + stack.stage // export name
  });
  stack.addOutputs({});
  return {
    auth
  };
}
