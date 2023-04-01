export const setProductAsNotFoundHandler = async ({ arg, client }) => {
  var result;
  const { productId, storeId, country, orderId } = arg[0];
  // const orderDoc = await findOne({_id: new ObjectId(orderId)}, {}, client.db("base").collection('orders'))
  await client
    .db('base')
    .collection('orders')
    .updateOne(
      {
        _id: new ObjectId(orderId),
      },
      {
        $set: {
          [`orders.$[store].addedProducts.$[product].pickup`]: {
            pickedUp: false,
            QTYFound: 0,
          },
        },
      },
      {
        arrayFilters: [
          { 'store._id': new ObjectId(storeId) },
          { 'product._id': new ObjectId(productId) },
        ],
      }
    );
  result = 'success';
  return result;
};
interface SetProductAsNotFoundProps extends Omit<MainFunctionProps, 'arg'> {}
import { ObjectId } from 'mongodb';
import { mainWrapper } from 'hyfn-server/src';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: setProductAsNotFoundHandler });
};
