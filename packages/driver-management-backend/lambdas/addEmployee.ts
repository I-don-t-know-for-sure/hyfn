import { MainFunctionProps, mainWrapper } from 'hyfn-server';

interface AddUserAsEmployeeProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const addUserAsEmployeeHandler = async ({ arg, client, userId }: AddUserAsEmployeeProps) => {
  const { employeeId } = arg[0];
  const managementDoc = await client
    .db('generalData')
    .collection('driverManagement')
    .findOne({ userId });
  if (!managementDoc) throw new Error('management not found');
  if (managementDoc.usersIds.includes(employeeId)) throw new Error('employee already exists');
  if (managementDoc.users[employeeId]) throw new Error('employee already exists');

  await client
    .db('generalData')
    .collection('driverManagement')
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
