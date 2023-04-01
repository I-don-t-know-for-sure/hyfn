interface BulkWriteProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
'use strict';

import { mainWrapper } from 'hyfn-server';

export const handler = async (event, ctx, callback) => {
  var result;

  const mainFunction = async ({ event, arg, client }) => {
    const { productsArray, storeId } = arg[0];
    const objKeysExample = ['name', 'price', 'barcode'];
    const objKeysDetailed = ['title', 'description', 'price', 'prevPrice', 'costPerItem'];

    // input.data.pop();
    const results = productsArray.data;
    const objKeys = results[0];
    console.log('🚀 ~ file: bulkWrite.js:20 ~ mainFunction ~ objKeys:', objKeys);
    objKeys.forEach((key) => {
      const found = objKeysExample.find((example) => {
        return example === key;
      });
      if (!found) throw new Error('keys don`t match');
    });

    var outputArray = [];
    for (let i = 1; i < results?.length; i++) {
      const row = results[i];
      var outputObject;

      for (let x = 0; x < row.length; x++) {
        if (objKeys[x] === 'name') {
          outputObject = {
            ...outputObject,
            textInfo: { title: row[x], description: row[x] },
          };
          continue;
        }
        console.log(`${row[x]}`);
        if (objKeys[x] === 'price') {
          outputObject = {
            ...outputObject,
            pricing: {
              price: `${row[x]}`,
              currency: 'LYD',
              prevPrice: `${row[x]}`,
              costPerItem: `${row[x]}`,
            },
          };
          continue;
        }
        if (objKeys[x] === 'barcode') {
          const libraryProductDoc = await client
            .db('productsLibrary')
            .collection('products')
            .findOne({ barcode: row[x].trim() }, { projection: { _id: 0, images: 1 } });

          outputObject = {
            ...outputObject,
            images: libraryProductDoc?.images,
          };
        }
      }
      // schema validation with yup

      const validated = {
        ...outputObject,
        storeId,
        options: {
          hasOptions: false,
          options: [],
        },
        weightInKilo: '0',
        isActive: false,
        collections: [],

        measurementSystem: 'Unit',
      };
      outputArray.push(validated);
    }

    if (outputArray?.length === 0) {
      throw new Error('file empty');
    }

    await client.db('base').collection('products').insertMany(outputArray);

    return result;
  };

  return await mainWrapper({ ctx, callback, event, mainFunction });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
