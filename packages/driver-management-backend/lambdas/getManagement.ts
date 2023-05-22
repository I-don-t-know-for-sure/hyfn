import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { sql } from 'kysely';
interface GetManagementProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const getManagementHandler = async ({ arg, client, userId, db }: GetManagementProps) => {
  const result = await db
    .selectFrom('driverManagements')
    .selectAll()
    .where('usersIds', '@>', sql`array[${sql.join([userId])}]::uuid[]`)
    .executeTakeFirstOrThrow();
  return result;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getManagementHandler });
};
