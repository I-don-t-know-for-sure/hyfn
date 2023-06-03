import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { returnsObj } from 'hyfn-types';

interface UpdateStoreDriverSettingsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}

export const updateStoreDriverSettings = async ({
  userId,
  db,
  arg,
}: UpdateStoreDriverSettingsProps) => {
  await db.transaction().execute(async (trx) => {
    const { onlyStoreDriversCanTakeOrders } = arg[0];
    const storeDoc = await trx
      .selectFrom('stores')
      .where('userId', '=', userId)
      .select(['id'])
      .executeTakeFirstOrThrow();
    await trx
      .updateTable('stores')
      .set({
        onlyStoreDriversCanTakeOrders: onlyStoreDriversCanTakeOrders,
      })
      .where('userId', '=', userId)
      .execute();

    await trx
      .updateTable('orders')
      .set({
        onlyStoreDriversCanTakeOrders,
      })
      .where('storeId', '=', storeDoc.id)
      .where('driverId', '=', null)
      .execute();
  });

  return returnsObj['success'];
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: updateStoreDriverSettings });
};
