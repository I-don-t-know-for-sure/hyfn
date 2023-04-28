interface DeleteLocalCardAPIKeyProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { MainFunctionProps, mainWrapper, withTransaction } from 'hyfn-server';
import { localCardKeysSchema, storeSchema } from '../resources';
import { z } from 'zod';
const deleteLocalCardAPIKey = async ({ client, arg }: MainFunctionProps) => {
  const session = client.startSession();
  const response = await withTransaction({
    session,
    fn: async () => {
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
    },
  });
  await session.endSession();
  return response;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: deleteLocalCardAPIKey });
};
