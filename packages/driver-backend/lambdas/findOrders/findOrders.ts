interface FindOrdersProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
import { ORDER_TYPE_DELIVERY, COLLECTION } from 'hyfn-types';
export const mainFunction = async ({ arg, client, event }: MainFunctionProps) => {
  console.log('🚀 ~ file: findOrders.ts:7 ~ COLLECTION:', COLLECTION);
  // await findOrderValidations(arg);
  console.log(event);
  const userCoords = arg[0];
  const { city, country, driverId, lastDoc } = arg[1];
  // the driver must be at most 2 kilos from the order to take it
  const driverData = await client.db('generalData').collection('driverData').findOne({
    driverId,
  });
  if (!driverData) {
    throw new Error('driver not found');
  }
  //   if (!driverData.verified && !driverData.balance) {
  //     throw new Error('Driver not verified');
  //   }
  console.log(driverData.onDuty);
  if (driverData.onDuty) {
    // const result = await client
    //   .db('base')
    //   .collection('orders')
    //   .findOne({
    //     _id: new ObjectId(driverData.orderId),
    //   });
    // console.log([result]);
    // return [result] || [];
  } else {
    const db = client.db('base');
    if (lastDoc) {
      const orders = await db
        .collection(`orders`)
        .find({
          $and: [
            {
              _id: { $gt: new ObjectId(lastDoc) },
              city,
              // coords: {
              //   $near: {
              //     $geometry: {
              //       type: 'Point',
              //       coordinates: [userCoords[1], userCoords[0]],
              //     },
              //     $maxDistance: 2000,
              //   },
              // },
              status: { $elemMatch: { userType: 'driver', _id: '' } },
              orderType: ORDER_TYPE_DELIVERY,
              canceled: { $exists: false },
            },
          ],
        })
        .limit(20)
        .toArray();
      return orders || [];
    }
    console.log('false');
    const orders = await db
      .collection(`orders`)
      .find({
        $and: [
          {
            // coords: {
            //   $near: {
            //     $geometry: {
            //       type: 'Point',
            //       coordinates: [userCoords[1], userCoords[0]],
            //     },
            //     $maxDistance: 2000,
            //   },
            // },
            city,
            status: { $elemMatch: { userType: 'driver', _id: '' } },
            orderType: ORDER_TYPE_DELIVERY,
            canceled: { $exists: false },
          },
        ],
      })
      .limit(20)
      .toArray();
    console.log('🚀 ~ file: findOrders.js:53 ~ mainFunction ~ orders', orders);
    console.log('🚀 ~ file: findOrders.js:53 ~ mainFunction ~ orders', orders);
    if (!orders) {
      return [];
    }
    console.log('anything');
    return orders || [];
  }
  // Ensures that the client will close when you finish/error
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction });
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
