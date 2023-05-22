import { MainFunctionProps, mainWrapper, firebaseApp } from 'hyfn-server';
import { app } from 'firebase-admin';

interface UpdateNotificationTokensProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const updateNotificationTokensHandler = async ({
  arg,
  client,
  userId,
  db,
}: UpdateNotificationTokensProps) => {
  const { notificationToken } = arg[0];
  const storeDoc = await db
    .selectFrom('stores')
    .select(['notificationToken'])
    .where('usersIds', '@>', [userId])
    .executeTakeFirstOrThrow();

  await db
    .updateTable('stores')
    .set({
      notificationToken: [...storeDoc.notificationToken, notificationToken],
    })
    .where('usersIds', '@>', [userId])
    .execute();

  const app: app.App = firebaseApp();
  app.messaging().subscribeToTopic(notificationToken, 'orders');
  return 'success';
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: updateNotificationTokensHandler });
};
