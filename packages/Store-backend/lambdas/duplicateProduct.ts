('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
interface DuplicateProductProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const duplicateProductHandler = async ({ arg, client, userId }: DuplicateProductProps) => {
  var result;
  const storeDoc = await client
    .db('generalData')
    .collection('storeInfo')
    .findOne({ usersIds: userId }, {});
  if (!storeDoc) throw new Error('store not found');
  const storeId = storeDoc._id.toString();
  const { times, productId, country } = arg[0];

  const product = await client
    .db('base')
    .collection('products')
    .findOne(
      { _id: new ObjectId(productId), storeId },
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
export const handler = async (event, ctx) => {
  return await mainWrapper({
    event,
    ctx,
    mainFunction: duplicateProductHandler,
  });
};
