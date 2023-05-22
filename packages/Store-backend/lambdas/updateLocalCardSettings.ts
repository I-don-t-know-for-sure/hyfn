export const updateLocalCardSettingsHandler = async ({
  arg,
  client,
  userId,
  db,
}: MainFunctionProps) => {
  type Store = z.infer<typeof storeSchema>;
  const storeDoc = await db
    .selectFrom('stores')
    .selectAll()
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();

  const includeLocalCardFeeToPrice = storeDoc.includeLocalCardFeeToPrice || false;

  await client
    .db('generalData')
    .collection<Store>('storeInfo')
    .updateOne(
      { userId },
      {
        $set: {
          includeLocalCardFeeToPrice: !includeLocalCardFeeToPrice,
        },
      }
    );
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
import { storeSchema } from 'hyfn-types';
import { z } from 'zod';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: updateLocalCardSettingsHandler });
};
