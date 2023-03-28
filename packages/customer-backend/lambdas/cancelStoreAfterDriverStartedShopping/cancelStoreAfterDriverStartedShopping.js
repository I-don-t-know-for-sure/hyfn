'use strict';

import { ObjectId } from 'mongodb';
import { mainValidateFunction } from '../common/authentication';

import { findOne } from '../common/mongoUtils/findOne';
import deepEqual from 'deep-equal';
import { getMongoClientWithIAMRole } from '../common/mongodb';
import { calculateOrdercost } from '../common/calculateOrderCost';
import { ORDER_TYPE_DELIVERY, ORDER_TYPE_PICKUP } from '../common/constants';
import { calculateOrderCostWithoutUpdatingDistance } from '../common/calculateOrderCostWithoutUpdatingDistance';
import { updateOne } from '../common/mongoUtils/updateOne';
import { deleteOne } from '../common/mongoUtils/deleteOne';
export const handler = async (event) => {
  var result;
  const client = await getMongoClientWithIAMRole();
  const arg = JSON.parse(event.body);
  const { country, orderId, storeId } = arg[0];
  const { accessToken, customerId } = arg[1];
  await mainValidateFunction(client, accessToken, customerId);
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
        //
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
          if (product?.pickup?.pickedUp) {
            return true;
          }
          return false;
        });

        if (didDriverPickProduct) {
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

          // const deliveryUrl = coords.reduce(
          //   (accum, point) => `${accum};${point[0]},${point[1]}`,

          //   `${orderDoc.buyerCoords[0]},${orderDoc.buyerCoords[1]}`
          // );

          // const deliveryDetails = await axios({
          //   method: 'get',
          //   url: `https://api.mapbox.com/directions/v5/mapbox/driving/${deliveryUrl}?annotations=maxspeed&overview=full&geometries=geojson&access_token=pk.eyJ1IjoiYmFyaW9teW1lbiIsImEiOiJjbDFrcXRnaHowM2lxM2Jtb3h3Z2J4bDQ0In0.DKfCj0bt3QfE9QgacrWnpA`,
          // });

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
            options: {},
            collection: client.db('generalData').collection('customerInfo'),
          });

          if (stores.length === 0) {
            await deleteOne({
              query: {
                _id: new ObjectId(orderId),
              },
              options: { session },
              collection: client.db('base').collection('orders'),
            });

            // update driver document to release them from the order onDuty: false

            return;
          }

          // console.log(
          //   deliveryDetails,
          //   deliveryFeeAfterFee,
          //   orderCostAfterFee,
          //   serviceFee,
          //   totalCost,
          //   allStoresDurations,
          //   durationInMinutes
          // );

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
            options: {},
            collection: client.db('generalData').collection('customerInfo'),
          });

          if (stores.length === 0) {
            await deleteOne({
              query: {
                _id: new ObjectId(orderId),
              },
              options: { session },
              collection: client.db('base').collection('orders'),
            });

            // update driver document to release them from the order onDuty: false

            return;
          }

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
