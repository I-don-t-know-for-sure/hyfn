import { MainFunctionProps, mainWrapper } from 'hyfn-server';

interface CreateManagementProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const createManagementHandler = async ({ arg, client, userId }: CreateManagementProps) => {
  const { balance, ...managerInfo } = arg[0];
  await client
    .db('generalData')
    .collection('driverManagement')
    .insertOne(
      {
        ...managerInfo,
        userId,

        balance: 0,
        usedBalance: 0,
        usersIds: [userId],
        users: {
          [userId]: {
            userType: 'owner',
          },
        },
      },
      {}
    );
  return 'sucess';
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: createManagementHandler });
};
