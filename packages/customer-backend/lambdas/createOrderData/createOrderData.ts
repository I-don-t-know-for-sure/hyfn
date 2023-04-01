interface CreateOrderDataProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
'use strict';
import axios from 'axios';
import { ObjectId } from 'mongodb';
import { getCustomerInfo } from '../common/getCustomerInfo';

import { updateAllOrder, updateOrderProducts } from '../common/utils';
import { mainWrapper } from 'hyfn-server/src';
import { MainFunctionProps } from 'hyfn-server/src';
import { z } from 'zod';

const inputValidation = z.object({});
const accessSession = z.object({});

interface CreateOrderDataProps extends Omit<MainFunctionProps, 'args'> {
  arg: any[];
}

export const createOrderData = async ({ arg, client, userId }: CreateOrderDataProps) => {
  const customerDoc = await getCustomerInfo({
    client,
    options: { projection: {}, session: undefined },
    userId,
  });

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

  const orders = customerDoc?.order?.orders;

  if (customerDoc.order) {
    var diffrent = false;
    // or stores are diffrent
    for (let i = 0; i < orderCart?.length; i++) {
      const store = orderCart[i];
      if (store._id !== orders[i]?._id) {
        diffrent = true;
      }
    }
    // check this out when free // customerDoc?.order?.orders?.length !== orderCart?.length || diffrent
    if (true) {
      await updateAllOrder(arg, client);
    } else {
      await updateOrderProducts(arg, client);
    }
  } else {
    await updateAllOrder(arg, client);
  }

  return JSON.stringify('success');

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: createOrderData });
};
