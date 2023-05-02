export const disableLocalCardAPIKeysHandler = async ({
  arg,
  client,
  userId,
}: MainFunctionProps) => {
  const session = client.startSession();
  const response = await withTransaction({
    session,
    fn: async () => {
      const storeDoc = await client

        .db('generalData')
        .collection('storeInfo')
        .findOne({ userId }, { session });
      if (storeDoc.opened) {
        throw new Error('store is open');
      }
      await client
        .db('generalData')
        .collection('storeInfo')
        .updateOne(
          { userId },
          {
            $set: {
              localCardAPIKeyFilled: false,
            },
          },
          { session }
        );
      await client
        .db('generalData')
        .collection('localCardKeys')
        .updateOne(
          { MerchantId: storeDoc?.localCardAPIKey?.MerchantId },
          {
            $set: {
              inUse: false,
            },
          },
          { session }
        );
    },
  });
  await session.endSession();
  return response;
};
interface DisableLocalCardAPIKeysProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { MainFunctionProps, mainWrapper, withTransaction } from 'hyfn-server';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: disableLocalCardAPIKeysHandler });
};
