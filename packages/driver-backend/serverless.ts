import { AWS } from '@serverless/typescript';
const serverlessConfig: AWS = {
  service: 'hyfn-driver',
  frameworkVersion: '3',
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    profile: 'default',
    deploymentMethod: 'direct',
    region: 'eu-south-1',
    httpApi: {
      cors: {
        allowedOrigins: ['https://driver.hyfn.xyz', '*'],
        allowedHeaders: ['Content-Type'],
        allowedMethods: ['POST'],
        exposedResponseHeaders: ['Special-Response-Header'],
        maxAge: 6000,
      },
    },
  },
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin', 'serverless-iam-roles-per-function'],
  package: {
    individually: true,
  },
  functions: {
    findOrders: {
      handler: '.build/lambdas/findOrders/findOrders.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/driver/findOrders',
          },
        },
      ],
    },
    getProposals: {
      handler: '.build/lambdas/getProposals/getProposals.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/driver/getProposals',
          },
        },
      ],
    },
    createProposal: {
      handler: '.build/lambdas/createProposal/createProposal.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/driver/createProposal',
          },
        },
      ],
    },
    updateProposal: {
      handler: '.build/lambdas/updateProposal/updateProposal.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/driver/updateProposal',
          },
        },
      ],
    },
    deleteProposal: {
      handler: '.build/lambdas/deleteProposal/deleteProposal.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/driver/deleteProposal',
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
            path: '/driver/setOrderAsDelivered',
          },
        },
      ],
    },
    reportOrder: {
      handler: '.build/lambdas/reportOrder/reportOrder.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/driver/reportOrder',
          },
        },
      ],
    },
    leaveOrder: {
      handler: '.build/lambdas/leaveOrder/leaveOrder.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/driver/leaveOrder',
          },
        },
      ],
    },
    takeOrder: {
      handler: '.build/lambdas/takeOrder/takeOrder.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/driver/takeOrder',
          },
        },
      ],
    },
    getActiveOrder: {
      handler: '.build/lambdas/getActiveOrder/getActiveOrder.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/driver/getActiveOrder',
          },
        },
      ],
    },
    setOrderAsPickedUp: {
      handler: '.build/lambdas/setOrderAsPickedUp/setOrderAsPickedUp.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/driver/setOrderAsPickedUp',
          },
        },
      ],
    },
    // setProductAsPickedUp: {
    //   handler: '.build/lambdas/setProductAsPickedUp/setProductAsPickedUp.handler',
    //   events: [
    //     {
    //       httpApi: {
    //         method: 'POST',
    //         path: '/driver/setProductAsPickedUp',
    //       },
    //     },
    //   ],
    // },
    // setProductAsNotFound: {
    //   handler: '.build/lambdas/setProductAsNotFound/setProductAsNotFound.handler',
    //   events: [
    //     {
    //       httpApi: {
    //         method: 'POST',
    //         path: '/driver/setProductAsNotFound',
    //       },
    //     },
    //   ],
    // },
    payStore: {
      handler: '.build/lambdas/payStore/payStore.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/driver/payStore',
          },
        },
      ],
    },
    setDeliveryFeePaid: {
      handler: '.build/lambdas/setDeliveryFeePaid/setDeliveryFeePaid.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/driver/setDeliveryFeePaid',
          },
        },
      ],
    },
    confirmPickup: {
      handler: '.build/lambdas/confirmPickup/confirmPickup.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/driver/confirmPickup',
          },
        },
      ],
    },
    createDriverDocument: {
      handler: '.build/lambdas/createDriverDocument/createDriverDocument.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/driver/createDriverDocument',
          },
        },
      ],
    },
    updateDriverDocument: {
      handler: '.build/lambdas/updateDriverDocument/updateDriverDocument.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/driver/updateDriverDocument',
          },
        },
      ],
    },
    getDriverDocument: {
      handler: '.build/lambdas/getDriverDocument/getDriverDocument.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/driver/getDriverDocument',
          },
        },
      ],
    },
    generateImageUrl: {
      handler: '.build/lambdas/generateImageUrl/generateImageUrl.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/driver/generateImageUrl',
          },
        },
      ],
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
    getOrderHistory: {
      handler: '.build/lambdas/getOrderHistory/getOrderHistory.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/driver/getOrderHistory',
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfig;
