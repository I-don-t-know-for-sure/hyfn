export const setProductAsNotFoundHandler = async ({ arg, client }: MainFunctionProps) => {
  var result;
  const { productId, storeId, country, orderId } = arg[0];
  // const orderDoc = await findOne({id: new ObjectId(orderId)}, {}, client.db("base").collection('orders'))
  await client
    .db('base')
    .collection('orders')
    .updateOne(
      {
        id: new ObjectId(orderId),
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
          { 'store.id': new ObjectId(storeId) },
          { 'product.id': new ObjectId(productId) },
        ],
      }
    );

  result = 'success';
  return result;
};
interface SetProductAsNotFoundProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { ObjectId } from 'mongodb';
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: setProductAsNotFoundHandler });
};
