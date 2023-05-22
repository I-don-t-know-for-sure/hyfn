('use strict');

import { mainWrapper } from 'hyfn-server';
import { MainFunctionProps } from 'hyfn-server';
import { z } from 'zod';
import { updateAllOrder } from './common/updateAllOrder';

interface CreateOrderDataProps extends Omit<MainFunctionProps, 'args'> {
  arg: any[];
}
export const createOrderData = async ({ arg, client, userId, db }: CreateOrderDataProps) => {
  const customerDoc = await db
    .selectFrom('customers')
    .selectAll()
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();
  // const arg = event;
  const orderCart = arg[0];
  const buyerInfo = arg[1];
  const metchesOrder = orderCart[0];
  const { country, city } = metchesOrder;
  // const { country } = arg[0];
  // const customerInfo = arg[0];
  if (!Array.isArray(orderCart)) {
    throw new Error('wrong');
  }
  if (orderCart.length > 4) {
    throw new Error('only 4 stores are allowed in an order');
  }
  const orderTypesDifferent = orderCart.some((store) => {
    return store.orderType !== orderCart[0].orderType;
  });
  if (orderTypesDifferent) {
    throw new Error('stores in order can`t have orderType of delivery and pickup');
  }
  // temp
  // const customerDoc = await client.db('generalData').collection('customerInfo').findOne(
  //   {
  //     _id: new ObjectId(_id.toString()),
  //   },
  //   {},
  // );

  // if (customerDoc.order) {
  //   var diffrent = false;
  //   // or stores are diffrent
  //   for (let i = 0; i < orderCart?.length; i++) {
  //     const store = orderCart[i];
  //     if (store._id !== orders[i]?._id) {
  //       diffrent = true;
  //     }
  //   }
  // check this out when free // customerDoc?.order?.orders?.length !== orderCart?.length || diffrent

  await updateAllOrder({ arg, client, customerDoc, db });
  // }
  return JSON.stringify('success');
  // Ensures that the client will close when you finish/error
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: createOrderData });
};
