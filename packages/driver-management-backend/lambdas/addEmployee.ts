import { MainFunctionProps, mainWrapper, tDriverManagement } from 'hyfn-server';
import { sql } from 'kysely';
import { returnsObj } from 'hyfn-types';
interface AddUserAsEmployeeProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const addUserAsEmployeeHandler = async ({
  arg,
  client,
  userId,
  db,
}: AddUserAsEmployeeProps) => {
  const { employeeId } = arg[0];

  const managementDoc = await db
    .selectFrom('driverManagements')
    .selectAll()
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();
  if (!managementDoc) throw new Error(returnsObj['management not found']);
  if (managementDoc.usersIds.includes(employeeId))
    throw new Error(returnsObj['employee already exists']);
  if (
    managementDoc.users.some((user) => {
      return user.userId === employeeId;
    })
  )
    throw new Error(returnsObj['employee already exists']);

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
  await db
    .updateTable('driverManagements')
    .set({
      usersIds: sql`usersids || ${employeeId}`,
      users: sql`users || ${
        { userType: 'employee', userId: employeeId } as tDriverManagement['users'][0]
      }`,
    })
    .execute();
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: addUserAsEmployeeHandler });
};
