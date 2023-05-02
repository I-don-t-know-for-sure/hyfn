import { MainFunctionProps, firebaseApp, mainWrapper } from 'hyfn-server';
import { app } from 'firebase-admin';

interface UpdateNotificationTokensProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const updateNotificationTokensHandler = async ({
  arg,
  client,
  userId,
}: UpdateNotificationTokensProps) => {
  const { notificationToken } = arg[0];

  await client
    .db('generalData')
    .collection('driverManagement')
    .updateOne(
      { userId },
      {
        $push: {
          notificationToken: {
            $each: [notificationToken],
            $slice: -50,
          },
        },
      }
    );
  const app: app.App = firebaseApp();
  app.messaging().subscribeToTopic(notificationToken, 'orders');
  return 'success';
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: updateNotificationTokensHandler });
};
