('use strict');
import { ObjectId } from 'mongodb';
import {
  orderSchema,
  STORE_STATUS_PENDING,
  USER_TYPE_CUSTOMER,
  USER_TYPE_DRIVER,
  deliveryServiceFee,
} from 'hyfn-types';
import { add, largerEq, multiply, subtract } from 'mathjs';
import { MainFunctionProps, mainWrapperWithSession } from 'hyfn-server';
import { z } from 'zod';
interface TakeOrderProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const takeOrderHandler = async ({ arg, session, client }: MainFunctionProps) => {
  var result = 'success';
  const { country, orderId, driverId } = arg[0];
  const db = client.db('base');
  const driverDoc = await client
    .db('generalData')
    .collection('driverData')
    .findOne(
      {
        _id: new ObjectId(driverId),
      },
      { session }
    );
  if (!driverDoc) {
    throw new Error('driver not found');
  }

  if (driverDoc.reported) {
    throw new Error('You have a reported order');
  }

  // if (driverDoc.onDuty) {
  //     throw new Error('you are on duty');
  // }
  // if (!driverDoc.verified) {
  //     throw new Error('you are not verified');
  // }
  if (!driverDoc?.driverManagement[0]) {
    throw new Error('You are not trusted by a driver management');
  }
  // if(!driverDoc.verified){
  //   throw new Error('You can`t take an order until we verify you')
  // }
  const orderDoc = await client
    .db('base')
    .collection('orders')
    .findOne({ _id: new ObjectId(orderId) }, { session });
  if (!orderDoc) {
    throw new Error('order not found');
  }

  // if (orderDoc.orderCost > 750) {
  //   throw new Error('You can`t take an order that costs more than 750');
  // }
  // if (driverDoc.balance < orderDoc.orderCost) {
  //   throw new Error('your balance is not enough for this order');
  // }
  // const wasDriverSetAsNotverified = driverDoc?.storeVerifications?.find((store) => {
  //   return store.verified === false;
  // });
  const orderCost = orderDoc.orderCost;
  const usedBalance = driverDoc.usedBalance || 0;
  const availableBalance = subtract(driverDoc.balance, usedBalance);
  const driverBalanceCanCoverTheOrder = largerEq(availableBalance, orderCost);
  const newUsedBalance = add(usedBalance, orderCost);
  if (!driverBalanceCanCoverTheOrder) {
    throw new Error('Balance is not enough');
  }
  const status = [
    ...orderDoc.status.map((status) => {
      if (status.userType === USER_TYPE_CUSTOMER) {
        return status;
      }
      if (status.userType === USER_TYPE_DRIVER) {
        return { ...status, _id: driverId };
      }
      return { ...status, status: STORE_STATUS_PENDING };
    }),
  ];
  const proposal = orderDoc.proposals.find(
    (proposal) => proposal.managementId === orderDoc.acceptedProposal
  );
  if (!proposal) {
    throw new Error('proposal not found');
  }
  const deliveryFee = proposal.price;
  // const managementCut = parseFloat(driverDoc.managementCut.toFixed(2));
  // console.log('🚀 ~ file: takeOrder.js:88 ~ mainFunction ~ managementCut', managementCut);
  const hyfnFee = multiply(deliveryFee, deliveryServiceFee);
  const deliveryFeeAfterHyfnFee = subtract(deliveryFee, hyfnFee);
  // const managementFee = multiply(deliveryFeeAfterHyfnFee, managementCut);
  const managementFee = deliveryFeeAfterHyfnFee;
  // const serviceFee = add(add(orderDoc.serviceFee, managementFee), hyfnFee);
  const serviceFee = add(orderDoc.serviceFee, hyfnFee);

  type Order = z.infer<typeof orderSchema>;
  await db.collection<Order>('orders').updateOne(
    {
      $and: [
        { _id: new ObjectId(orderId) },
        { status: { $elemMatch: { userType: USER_TYPE_DRIVER, _id: '' } } },
      ],
    },
    {
      $set: {
        status: status,
        driverManagement: driverDoc.driverManagement[0],
        deliveryFee: subtract(deliveryFee, hyfnFee),
        managementFee,
        serviceFee: serviceFee,
        // managementCut,
      },
    },
    { session }
  );
  await client
    .db('generalData')
    .collection('driverData')
    .updateOne(
      {
        _id: new ObjectId(driverId),
      },
      {
        $set: {
          usedBalance,
          onDuty: true,
        },
        $push: { orderIds: orderId },
      },
      { session }
    );
  return result;
};
export const handler = async (event) => {
  return await mainWrapperWithSession({
    mainFunction: takeOrderHandler,
    event,
  });
};
