import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { sql } from 'kysely';

interface StopAcceptingOrdersProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const stopAcceptingOrders = async ({ client, userId, db }: StopAcceptingOrdersProps) => {
  await db
    .updateTable('stores')
    .set({
      acceptingOrders: false,
    })
    .where('usersIds', '@>', sql`array[${sql.join([userId])}]::uuid[]`)
    .execute();
  return 'success';
};

export const handler = async (event: any) => {
  return await mainWrapper({ event, mainFunction: stopAcceptingOrders });
};
