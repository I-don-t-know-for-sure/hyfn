import {AWS} from '@serverless/typescript'
const serverlessConfig : AWS = {
    "service": "hyfn-products-library",
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
      "environment": {"kmsKeyARN": {
        "Fn::ImportValue" : {"Fn::Sub" : "${self:custom.hyfnResources}-${sls:stage}-paymentSecretKeyARN"}
      }}
    },
    "plugins": [
      "serverless-webpack",
      "serverless-dotenv-plugin"
    ],
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
    "functions": {
      "createProductInLibrary": {
        "handler": ".build/lambdas/createProduct/createProduct.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/productsLibrary/createProduct"
            }
          }
        ]
      },
      "deleteProductInLibrary": {
        "handler": ".build/lambdas/deleteProduct/deleteProduct.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/productsLibrary/deleteProduct"
            }
          }
        ]
      },
      "generateImageURL": {
        "handler": ".build/lambdas/generateImageURL/generateImageURL.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/productsLibrary/generateImageURL"
            }
          }
        ]
      },
      "updateProductInLibrary": {
        "handler": ".build/lambdas/updateProduct/updateProduct.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/productsLibrary/updateProduct"
            }
          }
        ]
      },
      "getProductInLibrary": {
        "handler": ".build/lambdas/getProduct/getProduct.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/productsLibrary/getProduct"
            }
          }
        ]
      },
      "getProductsInLibrary": {
        "handler": ".build/lambdas/getProducts/getProducts.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/productsLibrary/getProducts"
            }
          }
        ]
      },
      "createCompanyDocument": {
        "handler": ".build/lambdas/createCompanyDocument/createCompanyDocument.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/productsLibrary/createCompanyDocument"
            }
          }
        ]
      },
      "updateCompanyInfo": {
        "handler": ".build/lambdas/updateCompanyInfo/updateCompanyInfo.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/productsLibrary/updateCompanyInfo"
            }
          }
        ]
      },
      "getCompanyDocument": {
        "handler": ".build/lambdas/getCompanyDocument/getCompanyDocument.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/productsLibrary/getCompanyDocument"
            }
          }
        ]
      },
      "createBrand": {
        "handler": ".build/lambdas/createBrand/createBrand.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/productsLibrary/createBrand"
            }
          }
        ]
      },
      "updateBrand": {
        "handler": ".build/lambdas/updateBrand/updateBrand.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/productsLibrary/updateBrand"
            }
          }
        ]
      },
      "deleteBrand": {
        "handler": ".build/lambdas/deleteBrand/deleteBrand.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/productsLibrary/deleteBrand"
            }
          }
        ]
      },
      "getBrand": {
        "handler": ".build/lambdas/getBrand/getBrand.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/productsLibrary/getBrand"
            }
          }
        ]
      },
      "getBrands": {
        "handler": ".build/lambdas/getBrands/getBrands.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/productsLibrary/getBrands"
            }
          }
        ]
      },
      "getBrandsForList": {
        "handler": ".build/lambdas/getBrandsForList/getBrands.handler",
        "events": [
          {
            "httpApi": {
              "method": "POST",
              "path": "/productsLibrary/getBrandsForList"
            }
          }
        ]
      }
    }
  }


  module.exports = serverlessConfig