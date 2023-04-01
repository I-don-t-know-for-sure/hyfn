interface CreateOrderProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
'use strict';

import { ObjectId } from 'mongodb';

import { ORDER_TYPE_PICKUP, STORE_STATUS_NOT_SET } from 'hyfn-types';

import { smallerEq } from 'mathjs';
import { insertOne, mainWrapperWithSession, updateOne } from 'hyfn-server/src';
import { MainFunctionProps } from 'hyfn-server/src';
interface CreateOrderProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

const createOrder = async ({ arg, client, session, userId: customerId }: CreateOrderProps) => {
  const userInfo = await client
    .db('generalData')
    .collection('customerInfo')
    .findOne({ customerId }, { session });
  if (!userInfo) {
    throw new Error('jdjcb');
  }
  const userId = userInfo._id.toString();

  console.log(JSON.stringify(userInfo));
  const {
    order,
    name,

    balance = 0,
  } = userInfo;
  console.log(balance);

  const { country, city } = order.orders[0];
  const {
    storeServiceFee,
    duration,
    distance,
    buyerCoords,
    coords,
    orderCost,
    drivingDuration,
    inStoreDuration,
    deliveryFee,
    serviceFee,
    originalDeliveryFee,
    orderType,
    deliveryDate,
  } = order;

  console.log('🚀 ~ file: createOrder.ts:48 ~ mainFunction ~ dateObject:', new Date(deliveryDate));

  console.log('🚀 ~ file: createOrder.js:45 ~ mainFunction ~ serviceFee', serviceFee);

  const fixedBuyerCoords = [buyerCoords[0], buyerCoords[1]];
  const fixedGeometryCoordinates = coords.coordinates.map((coords) => [coords[0], coords[1]]);
  const fixedGeometry = {
    ...coords,
    coordinates: fixedGeometryCoordinates,
  };

  const isbalenceEnough = smallerEq(serviceFee, balance);
  console.log('🚀 ~ file: createOrder.js:63 ~ mainFunction ~ isbalenceEnough', isbalenceEnough);
  // Math.abs(parseFloat(balance).toFixed(3)) >= Math.abs(parseFloat(serviceFee).toFixed(3));
  console.log(Math.abs(parseFloat(balance)), 'hbdchbdchbdhcbbcdhbcdh');
  console.log(Math.abs(parseFloat(serviceFee)), 'gdgcvdcvdgvcdvcgdvgvc');

  // if (!isbalenceEnough && orderType === ORDER_TYPE_PICKUP) {
  //   throw new Error('balance not enough');
  // }

  console.log('hhdh');

  const mongo = client.db('base');
  const storesArray: any[] = [];
  for (let i = 0; i < order.orders?.length; i++) {
    const store = order.orders[i];
    const storeDoc = await mongo.collection('storeFronts').findOne(
      {
        _id: new ObjectId(store._id),
      },
      { session }
    );
    if (!storeDoc) {
      throw new Error('cd');
    }
    if (!storeDoc.opened) {
      throw new Error(`${storeDoc.storeName} is closed`);
    }
    storesArray.push(storeDoc);
  }

  const status = order.orders.map((store) => {
    return { _id: store._id, status: STORE_STATUS_NOT_SET, userType: 'store' };
  });
  console.log({
    orders: order.orders,
    name,
    userId,
    buyerCoords: fixedBuyerCoords,
    duration,
    distance,
    orderType,
    status: [...status, { _id: userId, status: 'customer', userType: 'customer' }],
    coords: fixedGeometry,
  });

  // const ordersObject = orders.reduce((accu, current) => {
  //   return { ...accu, [current._id]: current };
  // }, {});

  // console.log(ordersObject);
  const insertOrderResult = await mongo.collection(`orders`).insertOne(
    {
      orders: order.orders,
      name,
      userId,
      buyerCoords: fixedBuyerCoords,
      duration,
      city,
      distance,
      orderCost,
      drivingDuration,
      inStoreDuration,
      storeServiceFee,
      deliveryFee,
      serviceFee,
      originalDeliveryFee,
      serviceFeePaid: false,
      orderType,
      proposals: [],
      status: [
        ...status,
        { _id: userId, status: 'customer', userType: 'customer' },
        orderType !== ORDER_TYPE_PICKUP && { _id: '', status: 'not set', userType: 'driver' },
      ],
      coords: fixedGeometry,
      orderDate: new Date(),
      deliveryDate: new Date(deliveryDate),
      confirmationCode: new ObjectId().toString(),
    },
    { session }
  );
  insertOne({ insertOneResult: insertOrderResult });

  // if (orderType === ORDER_TYPE_PICKUP) {
  //   const updateCustomerResult = await client
  //     .db('generalData')
  //     .collection('customerInfo')
  //     .updateOne(
  //       {
  //         _id: new ObjectId(userId),
  //       },
  //       {
  //         $inc: { balance: -Math.abs(parseFloat(serviceFee.toFixed(3))) },
  //       },
  //       { session }
  //     );
  //   updateOne({ updateOneResult: updateCustomerResult });
  // }
  console.log('there is a result');

  return { message: 'success' };
};
export const handler = async (event) => {
  return await mainWrapperWithSession({ event, mainFunction: createOrder });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
