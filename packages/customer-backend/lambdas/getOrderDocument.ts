export const getOrderDocumentHandler = async ({ arg, client }: MainFunctionProps) => {
  const { orderId, country } = arg[0];
  // const ordeDoc = await findOne(
  //   { _id: new ObjectId(orderId) },
  //   {},
  //   client.db("base").collection('orders')
  // );
  const orderDoc = await client
    .db('base')
    .collection('orders')
    .findOne({ _id: new ObjectId(orderId) }, {});
  return orderDoc;
};
interface GetOrderDocumentProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { ObjectId } from 'mongodb';
import { mainWrapper } from 'hyfn-server/src';
import { MainFunctionProps } from 'hyfn-server/src';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getOrderDocumentHandler });
};