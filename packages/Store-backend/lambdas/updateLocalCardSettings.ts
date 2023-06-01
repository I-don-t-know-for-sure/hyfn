export const updateLocalCardSettingsHandler = async ({
  arg,
  client,
  userId,
  db,
}: MainFunctionProps) => {
  const storeDoc = await db
    .selectFrom('stores')
    .selectAll()
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();

  const includeLocalCardFeeToPrice = storeDoc.includeLocalCardFeeToPrice || false;

  await db
    .updateTable('stores')
    .set({
      includeLocalCardFeeToPrice: !includeLocalCardFeeToPrice,
    })
    .where('userId', '=', userId)
    .execute();
};
interface UpdateLocalCardSettingsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';

import { z } from 'zod';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: updateLocalCardSettingsHandler });
};
