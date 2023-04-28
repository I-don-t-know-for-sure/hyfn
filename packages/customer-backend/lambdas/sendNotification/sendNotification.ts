import { MainFunctionProps, firebaseApp, mainWrapper, withTransaction } from 'hyfn-server';
import admin from 'firebase-admin';
import * as fs from 'fs';
interface SendNotificationProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const sendNotificationHandler = async ({ arg, client, userId }: SendNotificationProps) => {
  const customerDoc = await client
    .db('generalData')
    .collection('customerInfo')
    .findOne({ customerId: userId });
  console.log(
    '🚀 ~ file: sendNotification.ts:27 ~ sendNotificationHandler ~ customerDoc:',
    customerDoc
  );
  /* const token = customerDoc.notificationToken[customerDoc.notificationToken.length - 1];
  const app = firebaseApp; */

  const session = client.startSession();
  /* const withTransaction = async ({ session, fn }) => {
    var result;
    try {
      await session.withTransaction(async () => {
        result = await fn();
      });
    } catch (e) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error(e);
    }

    return result;
  }; */

  const result = await withTransaction({
    session,
    fn: async () => {
      await client.db('testing').collection('test').insertOne(
        {
          test: 'jcbdcbd',
        },
        { session }
      );

      return 'inserted successfully';
    },
  });
  console.log('🚀 ~ file: sendNotification.ts:48 ~ sendNotificationHandler ~ result:', result);
  /* try {
    await session.withTransaction(async () => {
      result = await (async () => {
        await client.db('testing').collection('test').insertOne(
          {
            test: 'jcbdcbd',
          },
          { session }
        );
        return 'inserted successfully';
      })();
    });
    console.log('🚀 ~ file: sendNotification.ts:28 ~ result ~ result:', result);

    return result;
  } finally {
    await session.endSession();
  } */

  /* try {
    const result = await admin.messaging(app).send({
      notification: { title: 'test', body: 'test' },

      token: token,
    });
    console.log('🚀 ~ file: sendNotification.ts:41 ~ result ~ u:', result);
  } catch (error) {
    console.log('🚀 ~ file: sendNotification.ts:36 ~ sendNotificationHandler ~ error:', error);
  } */
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: sendNotificationHandler });
};
