import { AWS } from '@serverless/typescript';

// import { lambdaHandlers } from './lambdas'
const serverlessConfig: AWS = {
  service: 'hyfn-customer',
  frameworkVersion: '3',
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    profile: 'default',
    region: 'eu-south-1',
    stage: 'development',
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
  custom: {
    hyfnResources: 'hyfn-resources',
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
      packager: 'yarn',
      excludeFiles: 'src/**/*.test.js',
      webpackIncludeModules: {
        forceExclude: ['aws-sdk'],
      },
    },
  },
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
  package: {
    individually: true,
    patterns: ['!node_modules/**', 'node_modules/node-fetch/**'],
  },
  functions: {
    getStoreFronts: {
      handler: `.build/lambdas/getStoreFronts/getStoreFronts.handler`,
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/customer/getStoreFronts',
          },
        },
      ],
    },
    getCustomerData: {
      handler: '.build/lambdas/getCustomerData/getCustomerData.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/customer/getCustomerData',
          },
        },
      ],
    },
    createOrder: {
      handler: '.build/lambdas/createOrder/createOrder.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/customer/createOrder',
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
            path: '/customer/setOrderAsDelivered',
          },
        },
      ],
    },
    refreshOrderDocument: {
      handler: '.build/lambdas/refreshOrderDocument/refreshOrderDocument.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/customer/refreshOrderDocument',
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
            path: '/customer/setProductAsNotFound',
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
            path: '/customer/setProductAsPickedUp',
          },
        },
      ],
    },
    createOrderData: {
      handler: '.build/lambdas/createOrderData/createOrderData.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/customer/createOrderData',
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
            path: '/customer/getProduct',
          },
        },
      ],
    },
    payServiceFee: {
      handler: '.build/lambdas/payServiceFee/payServiceFee.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/customer/payServiceFee',
          },
        },
      ],
    },
    getStoreFront: {
      handler: `.build/lambdas/getStoreFront/getStoreFront.handler`,
      events: [
        {
          httpApi: {
            method: 'POST',
            path: `/customer/getStoreFront`,
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
            path: '/customer/getActiveOrders',
          },
        },
      ],
    },
    getOrderHistory: {
      handler: '.build/lambdas/getOrderHistory/getOrderHistory.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/customer/getOrderHistory',
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
            path: '/customer/getCollectionproducts',
          },
        },
      ],
    },
    refreshBalance: {
      handler: '.build/lambdas/refreshBalance/refreshBalance.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/customer/refreshBalance',
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
            path: '/customer/getDriverInfo',
          },
        },
      ],
    },
    createLocalCardTransaction: {
      handler:
        '.build/lambdas/payWithLocalCard/createLocalCardTransaction/createLocalCardTransaction.handler',
      timeout: 6,
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/customer/createLocalCardTransaction',
          },
        },
      ],
    },
    createServiceFeeCardTransaction: {
      handler:
        '.build/lambdas/payWithLocalCard/createServiceFeeCardTransaction/createServiceFeeCardTransaction.handler',
      timeout: 6,
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/customer/createServiceFeeCardTransaction',
          },
        },
      ],
    },
    cancelOrder: {
      handler: '.build/lambdas/cancelOrder/cancelOrder.handler',
      timeout: 6,
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/customer/cancelOrder',
          },
        },
      ],
    },
    reportOrder: {
      handler: '.build/lambdas/reportOrder/reportOrder.handler',
      timeout: 6,
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/customer/reportOrder',
          },
        },
      ],
    },
    createStoreLocalCardTransaction: {
      handler:
        '.build/lambdas/payStoreWithLocalCard/createStoreLocalCardTransaction/createStoreLocalCardTransaction.handler',
      timeout: 6,
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/customer/createStoreLocalCardTransaction',
          },
        },
      ],
      environment: {
        kmsKeyARN: {
          'Fn::ImportValue': {
            'Fn::Sub': '${self:custom.hyfnResources}-${sls:stage}-paymentSecretKeyARN',
          },
        },
      },
    },
    validateStoreLocalCardTransaction: {
      handler:
        '.build/lambdas/payStoreWithLocalCard/validateStoreLocalCardTransaction/validateStoreLocalCardTransaction.handler',
      timeout: 299,
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/customer/validateStoreLocalCardTransaction',
          },
        },
      ],
      environment: {
        kmsKeyARN: {
          'Fn::ImportValue': {
            'Fn::Sub': '${self:custom.hyfnResources}-${sls:stage}-paymentSecretKeyARN',
          },
        },
      },
    },
    getTransactionsList: {
      handler: '.build/lambdas/payWithLocalCard/getTransactionsList/getTransactionsList.handler',
      timeout: 6,
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/customer/getTransactionsList',
          },
        },
      ],
    },
    validateLocalCardTransaction: {
      handler:
        '.build/lambdas/payWithLocalCard/validateLocalCardTransaction/validateLocalCardTransaction.handler',
      timeout: 299,
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/customer/validateLocalCardTransaction',
          },
        },
      ],
    },
    createUserDocument: {
      handler: '.build/lambdas/createUserDocument/createUserDocument.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/customer/createUserDocument',
          },
        },
      ],
    },
    getTransactions: {
      handler: '.build/lambdas/getTransactions/getTransactions.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/customer/getTransactions',
          },
        },
      ],
    },
    updateUserDocument: {
      handler: '.build/lambdas/updateUserDocument/updateUserDocument.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/customer/updateUserDocument',
          },
        },
      ],
    },
    updateAddresses: {
      handler: '.build/lambdas/updateAddresses/updateAddresses.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/customer/updateAddresses',
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfig;
