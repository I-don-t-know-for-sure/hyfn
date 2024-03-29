export const rejectOrderHandler = async ({ arg, client, userId, db }: MainFunctionProps) => {
  var result;
  const { orderId, storeId, country } = arg[0];

  const userDocument = await db
    .selectFrom('stores')
    .selectAll()
    .where('usersIds', '@>', [userId])
    .executeTakeFirstOrThrow();
  const orderDoc = await client
    .db('base')
    .collection('orders')
    .findOne({ id: new ObjectId(orderId) }, {});
  // TODO:  check if the order was delivered
  if (orderDoc.delivered) {
    throw new Error(returnsObj['Order is already delivered']);
  }
  // TODO: check if the store was paid if true then throw an error
  const deletedStore = orderDoc.orders.find((store) => store.id === storeId);
  var storeCoords = deletedStore.coords;
  const storePaid = deletedStore.paid;
  if (userDocument.id.toString() !== deletedStore.id)
    throw new Error(returnsObj['Store id does not match']);
  const orderType = orderDoc.orderType;
  if (storePaid) throw new Error(returnsObj['Store is already paid']);

  const orderReported = orderDoc.reported;
  if (orderReported) throw new Error('this order is blocked because it`s reported');

  if (deletedStore.orderStatus !== storeStatusObject.pending) {
    throw new Error(returnsObj['can not edit the order after being accepted']);
  }

  const didDriverPickStoreProduct = deletedStore.addedProducts.some((product) => {
    return !!product?.pickup;
  });
  if (didDriverPickStoreProduct) {
    throw new Error(returnsObj['Driver started picking up the order']);
  }
  const stores = orderDoc.orders.filter((store) => {
    if (store.id?.toString() !== storeId) {
      return true;
    } else {
      storeCoords = store.coords;
      return false;
    }
  });
  if (deepEqual(orderDoc.orders, stores)) {
    throw new Error(returnsObj['order orders did not change']);
  }
  const status = orderDoc.status.filter((oldStatus) => {
    return oldStatus.userType !== 'store' && oldStatus.id?.toString() !== storeId;
  });
  if (deepEqual(orderDoc.status, status)) {
    throw new Error(returnsObj['order status did not change']);
  }

  if (orderType === orderTypesObject.Pickup) {
    throw new Error(returnsObj['service fee already paid']);
  }
  if (orderType === orderTypesObject.Delivery) {
    if (orderDoc.serviceFeePaid) {
      throw new Error(returnsObj['service fee already paid']);
    }
    const coords = orderDoc.coords.coordinates.filter((coord) => {
      return coord[0] !== storeCoords.coordinates[0] || coord[1] !== storeCoords.coordinates[1];
    });

    if (deepEqual(orderDoc.coords, coords)) {
      throw new Error(returnsObj['order coords did not change']);
    }
    if (orderDoc.orders.length === 1) {
      await client
        .db('base')
        .collection('orders')
        .updateOne(
          {
            id: new ObjectId(orderId),
          },
          {
            $set: {
              canceled: true,
            },
          },
          {}
        );
    }

    result = 'seccess';
    return 'success';
  }
  return result;
};
interface RejectOrderProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { ObjectId } from 'mongodb';

import deepEqual from 'deep-equal';
import { MainFunctionProps, mainWrapper } from 'hyfn-server';

import { orderTypesObject, returnsObj, storeStatusObject } from 'hyfn-types';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: rejectOrderHandler });
};
