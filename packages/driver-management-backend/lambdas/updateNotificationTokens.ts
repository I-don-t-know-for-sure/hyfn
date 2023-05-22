import { MainFunctionProps, firebaseApp, mainWrapper } from 'hyfn-server';
import { app } from 'firebase-admin';
import { sql } from 'kysely';

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

  await db
    .updateTable('driverManagements')
    .set({
      notificationTokens: sql`notification_tokens || ${notificationToken}`,
    })
    .where('userId', '=', userId)
    .executeTakeFirst();
  const app: app.App = firebaseApp();
  app.messaging().subscribeToTopic(notificationToken, 'orders');
  return 'success';
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: updateNotificationTokensHandler });
};
