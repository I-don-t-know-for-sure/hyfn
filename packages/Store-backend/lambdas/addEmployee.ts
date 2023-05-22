import { MainFunctionProps, mainWrapper, tStores } from 'hyfn-server';
import { sql } from 'kysely';

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
  // const storeDoc = await client.db('generalData').collection('storeInfo').findOne({ userId });
  const storeDoc = await db
    .selectFrom('stores')
    .selectAll()
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();
  // if (!storeDoc) throw 'Store not found';
  if (storeDoc.usersIds.includes(employeeId)) throw new Error('employee already exists');
  if (storeDoc.users[employeeId]) throw new Error('employee already exists');
  // await client
  //   .db('generalData')
  //   .collection('storeInfo')
  //   .updateOne(
  //     { userId },

  //     {
  //       $set: {
  //         [`users.${employeeId}`]: {
  //           userType: 'employee',
  //         },
  //       },
  //       $push: {
  //         usersIds: employeeId,
  //       },
  //     }
  //   );

  await db
    .updateTable('stores')
    .set({
      usersIds: sql`${tStores.usersIds} || ${employeeId}`,
      users: [...storeDoc.users, { userType: 'employee' }],
    })
    .where('userId', '=', userId)
    .execute();
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: addUserAsEmployeeHandler });
};
