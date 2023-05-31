export const getTrustedDriversHandler = async ({ arg, client, userId, db }: MainFunctionProps) => {
  const { storeId, lastDoc, management = 'driverManagements' } = arg[0];
  const userDocument = await db
    .selectFrom(management === 'driverManagements' ? 'driverManagements' : 'stores')
    .select('id')
    .where('usersIds', '@>', sql`array[${sql.join([userId])}]::uuid[]`)
    .executeTakeFirstOrThrow();
  const { id } = userDocument;
  const driverManagementId = id;

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
