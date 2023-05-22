import { MainFunctionProps, firebaseApp, mainWrapper } from 'hyfn-server';

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

  const customerDoc = await db
    .selectFrom('customers')
    .select('notificationTokens')
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();
  await db
    .updateTable('customers')
    .set({
      notificationTokens: [...customerDoc.notificationTokens, notificationToken],
    })
    .where('userId', '=', userId)
    .executeTakeFirst();
  return 'success';
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: updateNotificationTokensHandler });
};
