export const getOrderDocumentHandler = async ({ arg, client, db }: MainFunctionProps) => {
  const { orderId, country } = arg[0];
  // const ordeDoc = await findOne(
  //   { _id: new ObjectId(orderId) },
  //   {},
  //   client.db("base").collection('orders')
  // );
  // we need to join this with the orderProducts and store
  const orderDoc = await db
    .selectFrom('orders')
    .selectAll()
    .where('id', '=', orderId)
    .executeTakeFirstOrThrow();
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
