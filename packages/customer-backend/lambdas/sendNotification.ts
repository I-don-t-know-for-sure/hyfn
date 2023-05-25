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
  const app = firebaseApp();

  try {
    const result = await admin.messaging(app).send({
      notification: { title: 'test hdbchdbc', body: 'test' },
      webpush: {
        fcmOptions: {
          // link: 'https://hyfn.xyz',
        },
        headers: {
          Urgency: 'high',
        },
        notification: {
          // requireInteraction: true,
          actions: [
            {
              action: 'test',
              title: 'test',
              icon: 'https://development-hyfn-backend-ima-imagesbucket4336a197-ocngs9jrcxmp.s3.eu-west-3.amazonaws.com/tablet/c71c4bc1204694c38eee51a9be4ea090',
            },
          ],

          body: 'This is a message from FCM to web',
          // "requireInteraction": "true",
          icon: 'https://development-hyfn-backend-ima-imagesbucket4336a197-ocngs9jrcxmp.s3.eu-west-3.amazonaws.com/tablet/c71c4bc1204694c38eee51a9be4ea090',
          // image:
          //   'https://development-hyfn-backend-ima-imagesbucket4336a197-ocngs9jrcxmp.s3.eu-west-3.amazonaws.com/tablet/c71c4bc1204694c38eee51a9be4ea090',
          // badge:
          //   'https://development-hyfn-backend-ima-imagesbucket4336a197-ocngs9jrcxmp.s3.eu-west-3.amazonaws.com/tablet/c71c4bc1204694c38eee51a9be4ea090',
        },
      },

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
