'use strict';

import { ObjectId } from 'mongodb';
import { mainValidateFunction } from '../common/authentication';

import { findOne } from '../common/mongoUtils/findOne';
import deepEqual from 'deep-equal';
import { getMongoClientWithIAMRole } from '../common/mongodb';
import { calculateOrdercost } from '../common/calculateOrderCost';
import { ORDER_TYPE_DELIVERY, ORDER_TYPE_PICKUP, STORE_TYPE_RESTAURANT } from '../common/constants';
import { calculateOrderCostWithoutUpdatingDistance } from '../common/calculateOrderCostWithoutUpdatingDistance';
import { updateOne } from '../common/mongoUtils/updateOne';
import { deleteOne } from '../common/mongoUtils/deleteOne';
export const handler = async (event) => {
  var result;
  const client = await getMongoClientWithIAMRole();
  const arg = JSON.parse(event.body);
  const { country, orderId, storeId } = arg[0];
  // const { accessToken, customerId } = arg[1];
  // await mainValidateFunction(client, accessToken, customerId);
  const session = client.startSession();
  console.log(arg);
  try {
    await session.withTransaction(
      async () => {
        const orderDoc = await findOne(
          {
            _id: new ObjectId(orderId),
          },
          { session },
          client.db('base').collection('orders')
        );

        console.log('🚀 ~ file: cancelStore.js ~ line 28 ~ orderDoc', orderDoc);

        if (orderDoc.orders?.length === 0) {
          throw new Error('orderDoc not an array');
        }
        // if (orderDoc?.orders?.length === 1) {
        //   await client
        //     .db("base")
        //     .collection('orders')
        //     .deleteOne(
        //       {
        //         _id: new ObjectId(orderId),
        //       },
        //       { session }
        //     );
        //   result = 'order was deleted';
        //   return;
        // }
        const deletedStore = orderDoc.orders.find((store) => store._id.toString() === storeId);
        var storeCoords = deletedStore.coords;

        const didDriverPickProduct = deletedStore.addedProducts.some((product) => {
          if (!!product?.pickup) {
            return true;
          }
          return false;
        });

        const isRestaurant = deletedStore.storeType.includes(STORE_TYPE_RESTAURANT);

        const orderReported = orderDoc.reported;
        if (orderReported) {
          throw new Error('this order is blocked because it`s reported');
        }

        if (isRestaurant) {
          // the orderStatus field will be undefined until the store updates this field
          // if the store updates this field it means the store is either preparing the order or finished preparing it
          const isOrderReadyOrBeingPrepared = typeof deletedStore.orderStatus === 'string';
          if (isOrderReadyOrBeingPrepared) {
            throw new Error(
              'restuarant order can`t be canceled after the restuarant started preparing it'
            );
          }
        }

        // if the driver started picking up the order we will tell the customer on the frontend then if the
        // customer still wants to cancel we won't return their money back for that store
        if (didDriverPickProduct) {
          // await client
          //   .db("base")
          //   .collection('orders')
          //   .updateOne(
          //     { _id: new ObjectId(orderId) },
          //     {
          //       $set: {
          //         [`orders.$[store].canceled`]: true,
          //       },
          //     },
          //     { session, arrayFilters: [{ 'store._id': new ObjectId(storeId) }] }
          //   );

          throw new Error('driver already started picking up your order');
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

        if (deletedStore.orderType === ORDER_TYPE_DELIVERY) {
          // if the customer paid the service fee we will return their fee then delete the order document if this is the only store
          //
          if (!orderDoc.serviceFeePaid) {
            if (orderDoc.orders.length === 1) {
              await deleteOne({
                query: {
                  _id: new ObjectId(orderId),
                },
                options: { session },
                collection: client.db('base').collection('orders'),
              });
            }
            return;
          }

          if (orderDoc.orders.length === 1) {
            await deleteOne({
              query: {
                _id: new ObjectId(orderId),
              },
              options: { session },
              collection: client.db('base').collection('orders'),
            });

            await updateOne({
              query: {
                _id: new ObjectId(orderDoc.userId),
              },
              update: {
                $inc: {
                  balance: Math.abs(parseFloat(orderDoc.serviceFee.toFixed(3))),
                },
              },
              options: { session },
              collection: client.db('generalData').collection('customerInfo'),
            });
            return;
          }

          console.log(orderDoc.coords.coordinates, storeCoords.coordinates);
          const coords = orderDoc.coords.coordinates.filter((coord) => {
            return (
              coord[0] !== storeCoords.coordinates[0] || coord[1] !== storeCoords.coordinates[1]
            );
          });
          console.log('🚀 ~ file: cancelStore.js ~ line 77 ~ coords ~ coords', coords);
          console.log('🚀 ~ file: cancelStore.js ~ line 77 ~ coords ~ coords', orderDoc.coords);

          if (deepEqual(orderDoc.coords, coords)) {
            throw new Error('order coords did not change');
          }

          const {
            deliveryDetails,
            deliveryFeeAfterFee,
            orderCostAfterFee,
            serviceFee,
            totalCost,
            allStoresDurations,
            durationInMinutes,
          } = await calculateOrdercost({
            orderArray: orderDoc.orders,
            coordinates: coords,
            buyerCoords: orderDoc.buyerCoords,
          });
          if (orderDoc.serviceFeePaid) {
            const amountToReturnToCustomer = orderDoc.serviceFee - serviceFee;
            await updateOne({
              query: {
                _id: new ObjectId(orderDoc.userId),
              },
              update: {
                $inc: {
                  balance: Math.abs(parseFloat(amountToReturnToCustomer.toFixed(3))),
                },
              },
              options: { session },
              collection: client.db('generalData').collection('customerInfo'),
            });
          }

          await updateOne({
            query: {
              _id: new ObjectId(orderId),
            },
            update: {
              $set: {
                'orders': stores,
                status,
                'coords.coordinates': coords,
                'drivingDuration': deliveryDetails.data.routes[0].duration / 60,
                'inStoreDuration': allStoresDurations,
                'duration': parseFloat(durationInMinutes).toFixed(2),
                'distance': deliveryDetails.data.routes[0].distance,
                'deliveryFee': parseFloat(deliveryFeeAfterFee).toFixed(2),
                'serviceFee': parseFloat(serviceFee).toFixed(2),
                'totalCost': parseFloat(totalCost).toFixed(2),
                'orderCost': parseFloat(orderCostAfterFee).toFixed(2),
              },
            },
            options: { session },
            collection: client.db('base').collection('orders'),
          });
          result = 'store was removed';

          return;
        }
        if (deletedStore.orderType === ORDER_TYPE_PICKUP) {
          if (orderDoc.orders.length === 1) {
            await deleteOne({
              query: {
                _id: new ObjectId(orderId),
              },
              options: { session },
              collection: client.db('base').collection('orders'),
            });

            await updateOne({
              query: {
                _id: new ObjectId(orderDoc.userId),
              },
              update: {
                $inc: {
                  balance: Math.abs(parseFloat(orderDoc.serviceFee.toFixed(3))),
                },
              },
              options: { session },
              collection: client.db('generalData').collection('customerInfo'),
            });
          }

          const {
            // deliveryDetails,
            deliveryFeeAfterFee,
            orderCostAfterFee,
            serviceFee,
            totalCost,
            allStoresDurations,
            durationInMinutes,
          } = await calculateOrderCostWithoutUpdatingDistance({
            orderArray: orderDoc.orders,
            drivingDurationInMinutes: orderDoc.drivingDuration / 60,
            buyerCoords: orderDoc.buyerCoords,
          });

          const amountToReturnToCustomer = orderDoc.serviceFee - serviceFee;

          await updateOne({
            query: {
              _id: new ObjectId(orderDoc.userId),
            },
            update: {
              $inc: {
                balance: Math.abs(parseFloat(amountToReturnToCustomer.toFixed(3))),
              },
            },
            options: { session },
            collection: client.db('generalData').collection('customerInfo'),
          });

          // if (stores.length === 0) {
          //   await client
          //     .db("base")
          //     .collection('orders')
          //     .deleteOne(
          //       {
          //         _id: new ObjectId(orderId),
          //       },

          //       { session }
          //     );

          //   // update driver document to release them from the order onDuty: false

          //   return;
          // }

          await updateOne({
            query: {
              _id: new ObjectId(orderId),
            },
            update: {
              $set: {
                orders: stores,
                status,

                inStoreDuration: allStoresDurations,
                duration: parseFloat(durationInMinutes).toFixed(2),

                deliveryFee: parseFloat(deliveryFeeAfterFee).toFixed(2),
                serviceFee: parseFloat(serviceFee).toFixed(2),
                totalCost: parseFloat(totalCost).toFixed(2),
                orderCost: parseFloat(orderCostAfterFee).toFixed(2),
              },
            },
            options: { session },
            collection: client.db('base').collection('orders'),
          });
          return;
        }
      },
      {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' },
      }
    );
  } catch (error) {
    console.log('🚀 ~ file: cancelStore.js:303 ~ export const handler= ~ error', error);
    result = error.message;
  } finally {
    await session.endSession();

    console.log(result);
    return JSON.stringify(result);
  }

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
