import {AWS} from '@serverless/typescript'
const serverlessConfig : AWS = {
    "service": "hyfn-admin",
    "frameworkVersion": "3",
    "provider": {
      "name": "aws",
      "runtime": "nodejs16.x",
      "profile": "default",
      "region": "eu-south-1",
      "stage": "development",
      "iam": {
        "role": {
          "statements": [
            {
              "Effect": "Allow",
              "Action": [
                "kms:DescribeKey",
                "kms:Encrypt",
                "kms:Decrypt",
                "kms:ReEncrypt*",
                "kms:GenerateDataKey",
                "kms:GenerateDataKeyWithoutPlaintext"
              ],
              "Resource": {"Fn::ImportValue" : {"Fn::Sub" : "${self:custom.hyfnResources}-${sls:stage}-paymentSecretKeyARN"}}
            },
            {
              "Effect": "Allow",
              "Action": [
                "sns:SetSMSAttributes",
                "sns:Publish"
              ],
              "Resource": "*"
            }
          ]
        }
      },
      "httpApi": {
        "cors": {
          "allowedOrigins": [
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
      "environment": {
        "kmsKeyARN": {"Fn::ImportValue" : {"Fn::Sub" : "${self:custom.hyfnResources}-${sls:stage}-paymentSecretKeyARN"}}
      }
    },
    "plugins": [
      "serverless-webpack",
      "serverless-dotenv-plugin"
    ],
    "package": {
      "individually": true
    },
    "custom": {
      "hyfnResources": "hyfn-resources",
      "webpack": {
        "keepOutputDirectory": true
      }
    },
    "functions": {
      "createAdminDocument": {
        "handler": ".build/lambdas/createAdminDocument/createAdminDocument.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/admin/createAdminDocument"
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
              "path": "/admin/getPaymentRequests"
            }
          }
        ]
      },
      "completePaymentRequest": {
        "handler": ".build/lambdas/completePaymentRequest/completePaymentRequest.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/admin/completePaymentRequest"
            }
          }
        ]
      },
      "createPaymentRequestObject": {
        "handler": ".build/lambdas/createPaymentRequestObject/createPaymentRequestObject.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/admin/createPaymentRequestObject"
            }
          }
        ]
      },
      "removeDriverManagementVerification": {
        "handler": ".build/lambdas/removeDriverManagementVerification/removeDriverManagementVerification.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/admin/removeDriverManagementVerification"
            }
          }
        ]
      },
      "verifyDriverManagement": {
        "handler": ".build/lambdas/verifyDriverManagement/verifyDriverManagement.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/admin/verifyDriverManagement"
            }
          }
        ]
      },
      "getDriverManagement": {
        "handler": ".build/lambdas/getDriverManagement/getDriverManagement.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/admin/getDriverManagement"
            }
          }
        ]
      },
      "getUnverifiedDrivers": {
        "handler": ".build/lambdas/getUnverifiedDrivers/getUnverifiedDrivers.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/admin/getUnverifiedDrivers"
            }
          }
        ]
      },
      "getReports": {
        "handler": ".build/lambdas/getReports/getReports.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/admin/getReports"
            }
          }
        ]
      },
      "getAdminDocument": {
        "handler": ".build/lambdas/getAdminDocument/getAdminDocument.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/admin/getAdminDocument"
            }
          }
        ]
      },
      "setDriverAsVerified": {
        "handler": ".build/lambdas/setDriverAsVerified/setDriverAsVerified.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/admin/setDriverAsVerified"
            }
          }
        ]
      }
    }
  }


  module.exports = serverlessConfig