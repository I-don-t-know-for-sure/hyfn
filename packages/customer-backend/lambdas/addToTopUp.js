'use strict';

import axios from 'axios';
import { ObjectId } from 'mongodb';
import { mainValidateFunction } from './common/authentication';
import { getMongoClientWithIAMRole } from './common/mongodb';
import { updateOne } from './common/mongoUtils/updateOne';

export const handler = async (event) => {
  var result;
  const client = await getMongoClientWithIAMRole();
  const arg = JSON.parse(event.body);

  const { customerId, OTP, amountToBeAdded } = arg[0];
  const { accessToken, customerId: userId } = arg[arg.length - 1];
  console.log(arg[0]);
  await mainValidateFunction(client, accessToken, userId);

  const session = client.startSession();

  try {
    await session.withTransaction(
      async () => {
        const customerDoc = await client
          .db('generalData')
          .collection('customerInfo')
          .findOne({ _id: new ObjectId(customerId) }, { session });
        // if (!customerDoc.isPaying) {
        //   return "no transaction in progress";
        // }

        const config = {
          method: 'post',
          url: 'https://pgw-test.almadar.ly/api/Pay',
          headers: {
            'Authorization':
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiU2FkYWRQR1ciLCJjb3Jwb3JhdGVTZXJ2aWNlSWQiOjk4NywiYXBwSWQiOiJiZmIzNWM2MGQ1ZmI0NTI2OTgxZWVlNjVmZjk0YTgxOSIsImV4cCI6MTY4OTMyODYzMywiaXNzIjoiQ29yZXRlYyIsImF1ZCI6IlNBREFEUEdXIn0.kk3xPb8Na-fYooMYDjBJ6iWH6UWbhgKr3BD69h8BIlM',

            'Content-Type': 'application/json',
          },
          data: {
            OTP: OTP,
            transactionId: customerDoc.transactionId,
          },
          mode: 'no-cors',
        };

        // const payment = await axios(config);
        // console.log(payment.data);
        // if (payment.data.statusCode === 927) {
        //   result = payment.data.result;
        //   return;
        // }
        // if (payment.data.statusCode !== 0) {
        //   throw "transaction went wrong";
        // }

        // result = payment.data;
        await updateOne({
          collection: client.db('generalData').collection('customerInfo'),
          query: { _id: new ObjectId(customerId) },
          update: {
            $inc: {
              balance: Math.abs(parseFloat(amountToBeAdded.tofixed(3))),
            },
            $set: {
              isPaying: false,

              amountToBeAdded: 0,
              transactionId: 0,
            },
          },
          options: { session },
        });
        // await client
        //   .db('generalData')
        //   .collection('customerInfo')
        //   .updateOne(
        //     { _id: new ObjectId(customerId) },
        //     {
        //       $inc: {
        //         balance: Math.abs(parseFloat(amountToBeAdded.tofixed(3))),
        //       },
        //       $set: {
        //         isPaying: false,

        //         amountToBeAdded: 0,
        //         transactionId: 0,
        //       },
        //     },
        //     { session }
        //   );

        /* 
 TODO add transactionId and other payment info like phone number and maybe time to customerData collection
*/
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

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
