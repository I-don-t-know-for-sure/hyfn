import { AWS } from '@serverless/typescript';
const serverlessConfig: AWS = {
  service: 'hyfn-store',
  frameworkVersion: '3',
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    profile: 'default',
    region: 'eu-south-1',
    stage: 'development',
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'kms:DescribeKey',
              'kms:Encrypt',
              'kms:Decrypt',
              'kms:ReEncrypt*',
              'kms:GenerateDataKey',
              'kms:GenerateDataKeyWithoutPlaintext',
            ],
            Resource: {
              'Fn::ImportValue': {
                'Fn::Sub': '${self:custom.hyfnResources}-${sls:stage}-paymentSecretKeyARN',
              },
            },
          },
          {
            Effect: 'Allow',
            Action: ['sns:SetSMSAttributes', 'sns:Publish'],
            Resource: '*',
          },
        ],
      },
    },
    httpApi: {
      cors: {
        allowedOrigins: ['*'],
        allowedHeaders: ['Content-Type'],
        allowedMethods: ['POST'],
        exposedResponseHeaders: ['Special-Response-Header'],
        maxAge: 6000,
      },
    },
    environment: {
      kmsKeyARN: {
        'Fn::ImportValue': {
          'Fn::Sub': '${self:custom.hyfnResources}-${sls:stage}-paymentSecretKeyARN',
        },
      },
    },
  },
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
  package: {
    individually: true,
    patterns: ['!node_modules/**', 'node_modules/node-fetch/**'],
  },
  custom: {
    hyfnResources: 'hyfn-resources',
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
      packageManager: 'yarn',
      excludeFiles: 'src/**/*.test.js',
      webpackIncludeModules: {
        forceExclude: ['aws-sdk'],
      },
    },
  },
  functions: {
    imageResizeTrigger: {
      handler: '.build/lambdas/imageResizeTrigger/imageResizeTrigger.handler',
      timeout: 60,
      events: [
        {
          s3: {
            bucket: 'hyfn-delivery-${sls:stage}',
            event: 's3:ObjectCreated:*',
            rules: [
              {
                prefix: 'initial/',
              },
            ],
            existing: true,
          },
        },
      ],
    },
    getProductsForStore: {
      handler: '.build/lambdas/getProductsForStore/getProductsForStore.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/getProductsForStore',
          },
        },
      ],
    },
    setProductAsNotFound: {
      handler: '.build/lambdas/setProductAsNotFound/setProductAsNotFound.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/setProductAsNotFound',
          },
        },
      ],
    },
    setProductAsPickedUp: {
      handler: '.build/lambdas/setProductAsPickedUp/setProductAsPickedUp.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/setProductAsPickedUp',
          },
        },
      ],
    },
    updateLocalCardSettings: {
      handler: '.build/lambdas/updateLocalCardSettings/updateLocalCardSettings.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/updateLocalCardSettings',
          },
        },
      ],
    },
    disableLocalCardAPIKeys: {
      handler: '.build/lambdas/disableLocalCardAPIKeys/disableLocalCardAPIKeys.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/disableLocalCardAPIKeys',
          },
        },
      ],
    },
    setOrderAsAccepted: {
      handler: '.build/lambdas/setOrderAsAccepted/setOrderAsAccepted.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/setOrderAsAccepted',
          },
        },
      ],
    },
    setOrderAsDelivered: {
      handler: '.build/lambdas/setOrderAsDelivered/setOrderAsDelivered.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/setOrderAsDelivered',
          },
        },
      ],
    },
    getDriverInfo: {
      handler: '.build/lambdas/getDriverInfo/getDriverInfo.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/getDriverInfo',
          },
        },
      ],
    },
    addLocalCardPaymentAPIKey: {
      handler: '.build/lambdas/addLocalCardPaymentAPIKey/addLocalCardPaymentAPIKey.handler',
      timeout: 60,
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/addLocalCardPaymentAPIKey',
          },
        },
      ],
    },
    setOrderAsReady: {
      handler: '.build/lambdas/setOrderAsReady/setOrderAsReady.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/setOrderAsReady',
          },
        },
      ],
    },
    setOrderAsPreparing: {
      handler: '.build/lambdas/setOrderAsPreparing/setOrderAsPreparing.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/setOrderAsPreparing',
          },
        },
      ],
    },
    createLocalCardTransaction: {
      handler: '.build/lambdas/payWithLocalCard/createLocalCardTransaction.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/createLocalCardTransaction',
          },
        },
      ],
    },
    createLocalCardTransactionForWallet: {
      handler: '.build/lambdas/payWithLocalCard/createLocalCardTransactionForWallet.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/createLocalCardTransactionForWallet',
          },
        },
      ],
    },
    getProductFromBarcode: {
      handler: '.build/lambdas/getProductFromBarcode/getProductFromBarcode.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/getProductFromBarcode',
          },
        },
      ],
    },
    createCollectionWithActive: {
      handler: '.build/lambdas/createCollectionWithActive/handler.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/createCollection',
          },
        },
      ],
    },
    createStoreDocument: {
      handler: '.build/lambdas/createStoreDocument/createStoreDocument.handler',
      timeout: 6,
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/createStoreDocument',
          },
        },
      ],
    },
    createProduct: {
      handler: '.build/lambdas/createProduct/createProduct.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/createProduct',
          },
        },
      ],
    },
    getTransactionsList: {
      handler: '.build/lambdas/payWithLocalCard/getTransactionsList.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/getTransactionsList',
          },
        },
      ],
    },
    validateLocalCardTransaction: {
      handler: '.build/lambdas/payWithLocalCard/validateLocalCardTransaction.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/validateLocalCardTransaction',
          },
        },
      ],
    },
    deleteCollection: {
      handler: '.build/lambdas/deleteCollection/deleteCollection.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/deleteCollection',
          },
        },
      ],
    },
    updateStoreOwnerInfo: {
      handler: '.build/lambdas/updateStoreOwnerInfo/updateStoreOwnerInfo.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/updateStoreOwnerInfo',
          },
        },
      ],
    },
    updateStoreInfo: {
      handler: '.build/lambdas/updateStoreInfo/updateStoreInfo.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/updateStoreInfo',
          },
        },
      ],
    },
    getAllCollections: {
      handler: '.build/lambdas/getAllCollections/getAllCollections.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/getAllCollections',
          },
        },
      ],
    },
    getCollection: {
      handler: '.build/lambdas/getCollection/getCollection.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/getCollection',
          },
        },
      ],
    },
    getActiveOrders: {
      handler: '.build/lambdas/getActiveOrders/getActiveOrders.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/getActiveOrders',
          },
        },
      ],
    },
    updateCollection: {
      handler: '.build/lambdas/updateCollection/updateCollection.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/updateCollection',
          },
        },
      ],
    },
    updateProduct: {
      handler: '.build/lambdas/updateProduct/updateProduct.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/updateProduct',
          },
        },
      ],
    },
    getCollectionsForProduct: {
      handler: '.build/lambdas/getCollectionsForProduct/getCollectionsForProduct.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/getCollectionsForProduct',
          },
        },
      ],
    },
    deleteProduct: {
      handler: '.build/lambdas/deleteProduct/deleteProduct.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/deleteProduct',
          },
        },
      ],
    },
    getProduct: {
      handler: '.build/lambdas/getProduct/getProduct.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/getProduct',
          },
        },
      ],
    },
    getStoreDocument: {
      handler: '.build/lambdas/getStoreDocument/getStoreDocument.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/getStoreDocument',
          },
        },
      ],
    },
    updateProductState: {
      handler: '.build/lambdas/updateProductState/updateProductState.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/updateProductState',
          },
        },
      ],
    },
    openAndCloseStore: {
      handler: '.build/lambdas/openAndCloseStore/openAndCloseStore.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/openAndCloseStore',
          },
        },
      ],
    },
    updatePaymentSettings: {
      handler: '.build/lambdas/updatePaymentSettings/updatePaymentSettings.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/updatePaymentSettings',
          },
        },
      ],
    },
    paySubscription: {
      handler: '.build/lambdas/paySubscription/paySubscription.handler',
      url: {
        cors: {
          allowedHeaders: ['Content-Type'],
          allowedMethods: ['POST'],
        },
      },
    },
    getOrderHistory: {
      handler: '.build/lambdas/getOrderHistory/getOrderHistory.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/getOrderHistory',
          },
        },
      ],
    },
    generateImageURL: {
      handler: '.build/lambdas/generateImageURL/generateImageURL.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/generateImageURL',
          },
        },
      ],
    },
    rejectOrder: {
      handler: '.build/lambdas/rejectOrder/rejectOrder.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/rejectOrder',
          },
        },
      ],
    },
    searchProducts: {
      handler: '.build/lambdas/searchProducts/searchProducts.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/searchProducts',
          },
        },
      ],
    },
    bulkWrite: {
      handler: '.build/lambdas/bulkWrite/bulkWrite.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/bulkWrite',
          },
        },
      ],
    },
    getCollectionProducts: {
      handler: '.build/lambdas/getCollectionProducts/getCollectionProducts.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/getCollectionProducts',
          },
        },
      ],
    },
    getProductsForCollection: {
      handler: '.build/lambdas/getProductsForCollection/getProductsForCollection.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/getProductsForCollection',
          },
        },
      ],
    },
    bulkUpdate: {
      handler: '.build/lambdas/bulkUpdate/bulkUpdate.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/bulkUpdate',
          },
        },
      ],
    },
    updateOptions: {
      handler: '.build/lambdas/updateOptions/updateOptions.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/updateOptions',
          },
        },
      ],
    },
    getProductsForBulkUpdate: {
      handler: '.build/lambdas/getProductsForBulkUpdate/getProductsForBulkUpdate.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/getProductsForBulkUpdate',
          },
        },
      ],
    },
    duplicateProduct: {
      handler: '.build/lambdas/duplicateProduct/duplicateProduct.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/store/duplicateProduct',
          },
        },
      ],
    },
    getCollectionStoreFrontProducts: {
      handler:
        '.build/lambdas/getCollectionStoreFrontProducts/getCollectionStoreFrontProducts.handler',
      url: {
        cors: {
          allowedHeaders: ['Content-Type'],
          allowedMethods: ['POST'],
        },
      },
    },
  },
};

module.exports = serverlessConfig;
