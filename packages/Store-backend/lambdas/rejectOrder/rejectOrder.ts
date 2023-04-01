export const rejectOrderHandler = async ({ arg, client, userId }: MainFunctionProps) => {
  var result;
  const { orderId, storeId, country } = arg[0];
  type Store = z.infer<typeof storeSchema>;
  const userDocument = await client
    .db('generalData')
    .collection<Store>('storeInfo')
    .findOne({ userId });
  const orderDoc = await client
    .db('base')
    .collection('orders')
    .findOne({ _id: new ObjectId(orderId) }, {});
  // TODO:  check if the order was delivered
  if (orderDoc.delivered) {
    throw new Error('Order is already delivered');
  }
  // TODO: check if the store was paid if true then throw an error
  const deletedStore = orderDoc.orders.find((store) => store._id.toString() === storeId);
  var storeCoords = deletedStore.coords;
  const storePaid = deletedStore.paid;
  if (userDocument._id.toString() !== deletedStore._id.toString()) {
    throw new Error('Store id does not match');
  }
  const orderType = orderDoc.orderType;
  if (storePaid) {
    throw new Error('Store is already paid');
  }
  const orderReported = orderDoc.reported;
  if (orderReported) {
    throw new Error('this order is blocked because it`s reported');
  }
  // TODO: check if the driver picked any product
  const didDriverPickStoreProduct = deletedStore.addedProducts.some((product) => {
    return !!product?.pickup;
  });
  if (didDriverPickStoreProduct) {
    throw new Error('Driver started picking up the order');
  }
  const stores = orderDoc.orders.filter((store) => {
    console.log(store._id?.toString() !== storeId, store);
    if (store._id?.toString() !== storeId) {
      return true;
    } else {
      storeCoords = store.coords;
      return false;
    }
  });
  if (deepEqual(orderDoc.orders, stores)) {
    throw new Error('order orders did not change');
  }
  const status = orderDoc.status.filter((oldStatus) => {
    return oldStatus.userType !== 'store' && oldStatus._id?.toString() !== storeId;
  });
  if (deepEqual(orderDoc.status, status)) {
    throw new Error('order status did not change');
  }
  // TODO: check the order type then recalculate the order information after removing the store from the order
  // we can use the cancel store function as a reference then return the customer their money back
  console.log('🚀 ~ file: rejectOrder.js:71 ~ mainFunction ~ orderType', orderType);
  if (orderType === ORDER_TYPE_PICKUP) {
    console.log('🚀 ~ file: rejectOrder.js:71 ~ mainFunction ~ orderType', orderType);
    throw new Error('service fee already paid');
  }
  if (orderType === ORDER_TYPE_DELIVERY) {
    console.log('🚀 ~ file: rejectOrder.js:71 ~ mainFunction ~ orderType', orderType);
    if (orderDoc.serviceFeePaid) {
      throw new Error('service fee already paid');
    }
    const coords = orderDoc.coords.coordinates.filter((coord) => {
      return coord[0] !== storeCoords.coordinates[0] || coord[1] !== storeCoords.coordinates[1];
    });
    console.log('🚀 ~ file: cancelStore.js ~ line 77 ~ coords ~ coords', coords);
    console.log('🚀 ~ file: cancelStore.js ~ line 77 ~ coords ~ coords', orderDoc.coords);
    if (deepEqual(orderDoc.coords, coords)) {
      throw new Error('order coords did not change');
    }
    if (orderDoc.orders.length === 1) {
      await client
        .db('base')
        .collection('orders')
        .updateOne(
          {
            _id: new ObjectId(orderId),
            // status: { $elemMatch: { _id: storeId, userType: 'store' } },
          },
          {
            $set: {
              canceled: true,
            },
          },
          {}
        );
    }
    // const {
    //   deliveryDetails,
    //   deliveryFeeAfterFee,
    //   orderCostAfterFee,
    //   serviceFee,
    //   totalCost,
    //   allStoresDurations,
    //   durationInMinutes,
    // } = await calculateOrdercost({
    //   orderArray: orderDoc.orders,
    //   coordinates: coords,
    //   buyerCoords: orderDoc.buyerCoords,
    // });
    // await updateOne({
    //   query: {
    //     _id: new ObjectId(orderId),
    //     status: { $elemMatch: { _id: storeId, userType: 'store' } },
    //   },
    //   update: {
    //     $set: {
    //       'orders': stores,
    //       status,
    //       'coords.coordinates': coords,
    //       'drivingDuration': deliveryDetails.data.routes[0].duration / 60,
    //       'inStoreDuration': allStoresDurations,
    //       'duration': parseFloat(durationInMinutes).toFixed(2),
    //       'distance': deliveryDetails.data.routes[0].distance,
    //       'deliveryFee': parseFloat(deliveryFeeAfterFee).toFixed(2),
    //       'serviceFee': parseFloat(serviceFee).toFixed(2),
    //       'totalCost': parseFloat(totalCost).toFixed(2),
    //       'orderCost': parseFloat(orderCostAfterFee).toFixed(2),
    //     },
    //   },
    //   options: {},
    //   collection: client.db("base").collection('orders'),
    // });
    result = 'seccess';
    return 'success';
  }
  return result;
};
interface RejectOrderProps extends Omit<MainFunctionProps, 'arg'> {}
('use strict');
import { ObjectId } from 'mongodb';
import { ORDER_TYPE_DELIVERY, ORDER_TYPE_PICKUP, storeSchema } from '../resources';
import deepEqual from 'deep-equal';
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { z } from 'zod';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: rejectOrderHandler });
};
