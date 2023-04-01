interface DuplicateProductProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
'use strict';

import { mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';

export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client }) => {
    var result;

    const { times, productId, country } = arg[0];

    const product = await client
      .db('base')
      .collection('products')
      .findOne(
        { _id: new ObjectId(productId) },
        {
          projection: {
            _id: 0,
          },
        }
      );

    if (times > 30) {
      const products = Array(30)
        .fill(product)
        .map((value) => {
          return {
            ...value,
            isActive: false,
            _id: new ObjectId(),
          };
        });

      await client.db('base').collection('products').insertMany(products, {});
      return;
    }
    if (times === 0 || times < 0) {
      const products = Array(1)
        .fill(product)
        .map((value) => {
          return {
            ...value,
            isActive: false,
            _id: new ObjectId(),
          };
        });

      await client.db('base').collection('products').insertMany(products, {});
      return;
    }
    const products = new Array(times).fill(product).map((value) => {
      return {
        ...value,
        isActive: false,
        _id: new ObjectId(),
      };
    });

    await client.db('base').collection('products').insertMany(products, {});

    return result;
  };
  return await mainWrapper({
    event,
    ctx,
    mainFunction,
  });

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
