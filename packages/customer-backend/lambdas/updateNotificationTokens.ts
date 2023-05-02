import { MainFunctionProps, firebaseApp, mainWrapper } from 'hyfn-server';

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
    .collection('customerInfo')
    .updateOne(
      { customerId: userId },
      {
        $push: {
          notificationToken: {
            $each: [notificationToken],
            $slice: -5,
          },
        },
      }
    );

  return 'success';
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: updateNotificationTokensHandler });
};
