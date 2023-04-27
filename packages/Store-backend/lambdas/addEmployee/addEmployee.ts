import { MainFunctionProps, mainWrapper } from 'hyfn-server';

interface AddUserAsEmployeeProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const addUserAsEmployeeHandler = async ({ arg, client, userId }: AddUserAsEmployeeProps) => {
  const { employeeId } = arg[0];
  const storeDoc = await client.db('generalData').collection('storeInfo').findOne({ userId });
  if (!storeDoc) throw 'Store not found';
  if (storeDoc.usersIds.includes(employeeId)) throw new Error('employee already exists');
  if (storeDoc.users[employeeId]) throw new Error('employee already exists');
  await client
    .db('generalData')
    .collection('storeInfo')
    .updateOne(
      { userId },

      {
        $set: {
          [`users.${employeeId}`]: {
            userType: 'employee',
          },
        },
        $push: {
          usersIds: employeeId,
        },
      }
    );
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: addUserAsEmployeeHandler });
};
