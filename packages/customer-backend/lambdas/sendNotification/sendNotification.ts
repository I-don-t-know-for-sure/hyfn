import { MainFunctionProps, firebaseApp, mainWrapper } from 'hyfn-server';
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
  const token = customerDoc.notificationToken[customerDoc.notificationToken.length - 1];
  const app = firebaseApp;

  try {
    const result = await admin.messaging(app).send({
      notification: { title: 'test', body: 'test' },

      token: token,
    });
    console.log('🚀 ~ file: sendNotification.ts:41 ~ result ~ u:', result);
  } catch (error) {
    console.log('🚀 ~ file: sendNotification.ts:36 ~ sendNotificationHandler ~ error:', error);
  }
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: sendNotificationHandler });
};
