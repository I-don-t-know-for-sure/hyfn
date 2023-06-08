import admin from "firebase-admin";

import firebaseApp from "./getFirebaseApp";

/* 

{
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
      }

*/
export const sendNotification = async (
  app: ReturnType<typeof firebaseApp>,
  message: admin.messaging.Message
) => {
  return await admin.messaging(app).send(message);
};
