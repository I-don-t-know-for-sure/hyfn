export const getTrustedDriversHandler = async ({ arg, client, userId, db }: MainFunctionProps) => {
  const userDocument = await db
    .selectFrom('driverManagements')
    .select('id')
    .where('usersIds', '@>', sql`array[${sql.join([userId])}]::uuid[]`)
    .executeTakeFirstOrThrow();
  const { id } = userDocument;
  const driverManagementId = id;
  const { storeId, lastDoc } = arg[0];

  const drivers = await db
    .selectFrom('drivers')
    .selectAll()
    .where('driverManagement', '=', driverManagementId)
    .execute();
  return drivers;
};
interface GetTrustedDriversProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { sql } from 'kysely';

export const handler = async (event) => {
  const result = await mainWrapper({ event, mainFunction: getTrustedDriversHandler });
  return result;
};
