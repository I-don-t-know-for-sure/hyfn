import { MainFunctionProps, mainWrapperWithSession } from 'hyfn-server';
import { localCardKeysSchema, storeSchema } from '../resources';
import { z } from 'zod';

const deleteLocalCardAPIKey = async ({ client, arg, session }: MainFunctionProps) => {
  const { userId } = arg[arg.length - 1];
  type Store = z.infer<typeof storeSchema>;
  const storeDoc = await client
    .db('generalData')
    .collection<Store>('storeDoc')
    .findOne<Store>(
      { userId },
      {
        projection: {
          localCardAPIKey: 1,
        },
      }
    );

  await client
    .db('generalData')
    .collection<Store>('storeInfo')
    .updateOne(
      { userId },
      {
        $unset: { localCardAPIKey: '' },
        $set: {
          localCardAPIKeyFilled: false,
        },
      },
      { session }
    );

  await client
    .db('generalData')
    .collection<z.infer<typeof localCardKeysSchema>>('localCardKeys')
    .updateOne(
      { storeId: storeDoc._id.toString() },
      {
        $set: {
          inUse: false,
        },
      },
      { session }
    );
  return 'success';
};

export const handler = async (event) => {
  return await mainWrapperWithSession({ event, mainFunction: deleteLocalCardAPIKey });
};
