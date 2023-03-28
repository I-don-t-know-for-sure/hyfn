import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { storeSchema } from '../resources';
import { z } from 'zod';

export const handler = async (event) => {
  const mainFunction = async ({ arg, client, userId }: MainFunctionProps) => {
    type Store = z.infer<typeof storeSchema>;

    const storeDoc = await client
      .db('generalData')
      .collection<Store>('storeInfo')
      .findOne<Store>(
        { userId },
        {
          projection: {
            includeLocalCardFeeToPrice: 1,
          },
        }
      );
    console.log('🚀 ~ file: updateLocalCardSettings.ts:13 ~ storeDoc ~ storeDoc:', storeDoc);
    const includeLocalCardFeeToPrice = storeDoc.includeLocalCardFeeToPrice || false;
    console.log(
      '🚀 ~ file: updateLocalCardSettings.ts:14 ~ mainFunction ~ includeLocalCardFeeToPrice:',
      includeLocalCardFeeToPrice
    );
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
  };
  return await mainWrapper({ event, mainFunction });
};
