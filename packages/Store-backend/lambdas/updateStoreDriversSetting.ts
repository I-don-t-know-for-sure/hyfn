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
  const { onlyStoreDriversCanTakeOrders } = arg[0];
  await db
    .updateTable('stores')
    .set({
      onlyStoreDriversCanTakeOrders: onlyStoreDriversCanTakeOrders,
    })
    .where('userId', '=', userId)
    .execute();
  return returnsObj['success'];
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: updateStoreDriverSettings });
};
