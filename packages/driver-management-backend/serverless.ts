import {AWS} from '@serverless/typescript'
const serverlessConfig: AWS = {
    "service": "hyfn-driver-management",
    "frameworkVersion": "3",
    "provider": {
      "name": "aws",
      "runtime": "nodejs16.x",
      "profile": "default",
      "deploymentMethod": "direct",
      "region": "eu-south-1",
      "httpApi": {
        "cors": {
          "allowedOrigins": [
            "https://driverManagment.hyfn.xyz",
            "*"
          ],
          "allowedHeaders": [
            "Content-Type"
          ],
          "allowedMethods": [
            "POST"
          ],
          "exposedResponseHeaders": [
            "Special-Response-Header"
          ], 
          "maxAge": 6000
        }
      },
      "environment": 
        {"kmsKeyARN":{  "Fn::ImportValue" : {"Fn::Sub" : "${self:custom.hyfnResources}-${sls:stage}-paymentSecretKeyARN"}}}
      
    },
    "package": {
      "individually": true,
      "patterns": [
        "!node_modules/**",
        "node_modules/node-fetch/**"
      ]
    },
    "custom": {
      "hyfnResources": "hyfn-resources",
      "webpack": {
        "webpackConfig": "./webpack.config.js",
        "includeModules": true,
        "packager": "yarn",
        "excludeFiles": "src/**/*.test.js",
        "webpackIncludeModules": {
          "forceExclude": [
            "aws-sdk"
          ]
        }
      }
    },
    "plugins": [
      "serverless-webpack",
      "serverless-dotenv-plugin"
    ],
    "functions": {
      "addLocalCardKeys": {
        "handler": ".build/lambdas/addLocalCardKeys/addLocalCardKeys.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/driverManagement/addLocalCardKeys"
            }
          }
        ]
      },
      "getPaymentRequests": {
        "handler": ".build/lambdas/getPaymentRequests/getPaymentRequests.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/driverManagement/getPaymentRequests"
            }
          }
        ]
      },
      "cancelPaymentRequest": {
        "handler": ".build/lambdas/cancelPaymentRequest/cancelPaymentRequest.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/driverManagement/cancelPaymentRequest"
            }
          }
        ]
      },
      "createPaymentRequest": {
        "handler": ".build/lambdas/createPaymentRequest/createPaymentRequest.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/driverManagement/createPaymentRequest"
            }
          }
        ]
      },
      "DisableLocalCardKeys": {
        "handler": ".build/lambdas/DisableLocalCardKeys/DisableLocalCardKeys.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/driverManagement/DisableLocalCardKeys"
            }
          }
        ]
      },
      "reportOrder": {
        "handler": ".build/lambdas/reportOrder/reportOrder.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/driverManagement/reportOrder"
            }
          }
        ]
      },
      "searchDriverById": {
        "handler": ".build/lambdas/searchDriverById/searchDriverById.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/driverManagement/searchDriverById"
            }
          }
        ]
      },
      "getTrustedDrivers": {
        "handler": ".build/lambdas/getTrustedDrivers/getTrustedDrivers.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/driverManagement/getTrustedDrivers"
            }
          }
        ]
      },
      "getManagement": {
        "handler": ".build/lambdas/getManagement/getManagement.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/driverManagement/getManagement"
            }
          }
        ]
      },
      "addToManagementDrivers": {
        "handler": ".build/lambdas/addDriverToManagementDrivers/addDriverToManagementDrivers.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/driverManagement/addDriverToManagementDrivers"
            }
          }
        ]
      },
      "createManagement": {
        "handler": ".build/lambdas/createManagement/createManagement.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/driverManagement/createManagement"
            }
          }
        ]
      },
      "getActiveOrders": {
        "handler": ".build/lambdas/getActiveOrders/getActiveOrders.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/driverManagement/getActiveOrders"
            }
          }
        ]
      },
      "getDriverInfo": {
        "handler": ".build/lambdas/getDriverInfo/getDriverInfo.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/driverManagement/getDriverInfo"
            }
          }
        ]
      },
      "getOrderHistory": {
        "handler": ".build/lambdas/getOrderHistory/getOrderHistory.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/driverManagement/getOrderHistory"
            }
          }
        ]
      },
      "updateDriverBalance": {
        "handler": ".build/lambdas/updateDriverBalance/updateDriverBalance.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/driverManagement/updateDriverBalance"
            }
          }
        ]
      },
      "updateManagementInfo": {
        "handler": ".build/lambdas/updateManagementInfo/updateManagementInfo.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/driverManagement/updateManagementInfo"
            }
          }
        ]
      },
      "removeFromManagementDrivers": {
        "handler": ".build/lambdas/removeDriverFromManagementDrivers/removeDriverFromManagementDrivers.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/driverManagement/removeDriverFromManagementDrivers"
            }
          }
        ]
      },
      "createLocalCardTransaction": {
        "handler": ".build/lambdas/payWithLocalCard/createLocalCardTransaction.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/driverManagement/createLocalCardTransaction"
            }
          }
        ]
      },
      "getTransactionsList": {
        "handler": ".build/lambdas/payWithLocalCard/getTransactionsList.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/driverManagement/getTransactionsList"
            }
          }
        ]
      },
      "validateLocalCardTransaction": {
        "handler": ".build/lambdas/payWithLocalCard/validateLocalCardTransaction.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/driverManagement/validateLocalCardTransaction"
            }
          }
        ]
      }
    }
  }

  module.exports = serverlessConfig