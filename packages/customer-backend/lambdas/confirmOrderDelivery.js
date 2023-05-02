'use strict';

import { ObjectId } from 'mongodb';

import { mainValidateFunction } from '../common/authentication';
import { rateDriver } from './common/utils';
import { findOne } from '../common/mongoUtils/findOne';
import { getMongoClientWithIAMRole } from '../common/mongodb';
import deepEqual from 'deep-equal';
import { updateOne } from '../common/mongoUtils/updateOne';
export const handler = async (event) => {
  try {
    var result;
    const client = await getMongoClientWithIAMRole();
    const arg = JSON.parse(event.body);
    const { customerId, country, orderId } = arg[0];
    const { accessToken, customerId: userId } = arg[arg.length - 1];
    await mainValidateFunction(client, accessToken, userId);
    const { newRating } = arg[1];

    const session = client.startSession();
    try {
      await session.withTransaction(
        async () => {
          console.log('start');
          const orderDoc = await findOne(
            {
              _id: new ObjectId(orderId),
            },
            { session },
            client.db('base').collection('orders')
          );
          const { _id, status: driverStatus } = orderDoc.status.find(
            (status) => status.userType === 'driver'
          );
          if (_id === 'non' || _id === '') {
            result = 'no driver was assigned to this order yet';
            return;
          }
          if (driverStatus !== 'delivered') {
            result = 'driver didn`t deliver the order yet';
            return;
          }
          orderDoc.orders.some((store) => {
            if (!store?.payment?.paid) {
              result = 'not all stores are paid';
              throw new Error('not all stores are paid');
            }

            return;
          });
          if (newRating && newRating > 0) {
            const { _id: driverId } = orderDoc.status.find((status) => {
              return status.userType === 'driver';
            });
            await rateDriver({
              newRating,
              customerId,
              country,
              orderId,
              driverId,
              client,
              session,
            });
            console.log(25, orderDoc);
          }
          const status = orderDoc.status.map((status) => {
            if (status._id === 'all') {
              return { ...status, status: 'delivered' };
            }
            if (status._id === customerId) {
              return { ...status, status: 'delivered' };
            }
            return status;
          });

          if (deepEqual(orderDoc.status, status)) {
            throw new Error('order status did not change');
          }

          console.log(35);
          const order = await updateOne({
            query: { _id: new ObjectId(orderId) },
            update: {
              $set: {
                status,
              },
            },
            options: { session },
            collection: client.db('base').collection('orders'),
          });
          const driver = orderDoc.status.find((status) => {
            return status.userType === 'driver';
          });
          console.log(51, JSON.stringify(order));
          await updateOne({
            query: {
              driverId: driver._id,
            },
            update: {
              $set: {
                onDuty: false,
                orderId: '',
              },
            },
            options: { session },
            collection: client.db('generalData').collection('driverData'),
          });
          console.log(67);
          result = 'success';
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

      return JSON.stringify(result);
    }
  } catch (e) {
    return new Error(e.message);
  }
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
