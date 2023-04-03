export const duplicateProductHandler = async ({ arg, client }) => {
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
interface DuplicateProductProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event, ctx) => {
  return await mainWrapper({
    event,
    ctx,
    mainFunction: duplicateProductHandler,
  });
};
