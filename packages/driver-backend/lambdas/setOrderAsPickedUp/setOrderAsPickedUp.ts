export const setOrderAsPickedUpHandler = async ({
  arg,
  session,
  client,
  event,
}: MainFunctionProps) => {
  var result;
  const { id, country, driverId } = arg[0];
  const driverDoc = await client.db('generalData').collection('driverData').findOne(
    {
      driverId,
    },
    {}
  );
  const { orderId } = driverDoc;
  console.log(driverDoc, orderId);
  await client
    .db('base')
    .collection('orders')
    .updateOne(
      { '_id': new ObjectId(orderId), 'status._id': id },
      {
        $set: {
          'status.$': { _id: id, status: 'picked up' },
        },
      },
      {}
    );
  // const session = client.startSession();
  // await session.withTransaction(async () => {}, {
  //   readPreference: "primary",
  //   readConcern: { level: "local" },
  //   writeConcern: { w: "majority" },
  // });
  // try {
  // } catch (error) {
  //   return new Error(error.message);
  // } finally {
  //   await session.endSession();
  //   await client.close();
  // }
  return 'success';
};
interface SetOrderAsPickedUpProps extends Omit<MainFunctionProps, 'arg'> {}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: setOrderAsPickedUpHandler });
};
