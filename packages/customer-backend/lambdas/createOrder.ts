interface CreateOrderProps extends Omit<MainFunctionProps, 'arg'> {}
('use strict');
import { ObjectId } from 'mongodb';
import {
  ORDER_STATUS_ACCEPTED,
  ORDER_STATUS_PENDING,
  ORDER_TYPE_PICKUP,
  STORE_STATUS_NOT_SET,
} from 'hyfn-types';
import { smallerEq } from 'mathjs';
import { insertOne, mainWrapper, MainFunctionProps, withTransaction } from 'hyfn-server';

interface CreateOrderProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
const createOrder = async ({ arg, client, userId: customerId }: CreateOrderProps) => {
  const session = client.startSession();
  const result = await withTransaction({
    session,
    fn: async () => {
      const userInfo = await client
        .db('generalData')
        .collection('customerInfo')
        .findOne({ customerId }, { session });
      if (!userInfo) {
        throw new Error('user document not found');
      }
      const userId = userInfo.id;

      const { order, name, balance = 0 } = userInfo;

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

      const fixedBuyerCoords = [buyerCoords[0], buyerCoords[1]];
      const fixedGeometryCoordinates = coords.coordinates.map((coords) => [coords[0], coords[1]]);
      const fixedGeometry = {
        ...coords,
        coordinates: fixedGeometryCoordinates,
      };

      // Math.abs(parseFloat(balance).toFixed(3)) >= Math.abs(parseFloat(serviceFee).toFixed(3));

      const mongo = client.db('base');
      const storesArray: any[] = [];
      for (let i = 0; i < order.orders?.length; i++) {
        const store = order.orders[i];
        const storeDoc = await mongo.collection('storeFronts').findOne(
          {
            id: new ObjectId(store.id),
          },
          { session }
        );
        if (!storeDoc) {
          throw new Error('cd');
        }
        if (storeDoc.subscriptionInfo.expirationDate < new Date()) {
          throw new Error('store subscription expired');
        }
        if (!storeDoc.opened || !storeDoc.acceptingOrders) {
          throw new Error(`${storeDoc.storeName} is closed`);
        }
        storesArray.push(storeDoc);
      }
      const status = order.orders.map((store) => {
        return { id: store.id, status: ORDER_STATUS_PENDING, userType: 'store' };
      });

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
            { id: userId, status: 'customer', userType: 'customer' },
            orderType !== ORDER_TYPE_PICKUP && { id: '', status: 'not set', userType: 'driver' },
          ],
          coords: fixedGeometry,
          orderDate: new Date(),
          deliveryDate: new Date(deliveryDate),
          confirmationCode: new ObjectId().toString(),
        },
        { session }
      );

      return { message: 'success' };
    },
  });
  await session.endSession();
  return result;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: createOrder });
  // Ensures that the client will close when you finish/error
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
