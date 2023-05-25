import { app } from 'firebase-admin';

import { MainFunctionProps, firebaseApp, mainWrapper } from 'hyfn-server';
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

  const driverDoc = await db
    .selectFrom('drivers')
    .select('notificationTokens')
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();
  await db
    .updateTable('drivers')
    .set({
      notificationTokens: [...(driverDoc.notificationTokens || []), notificationToken],
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
