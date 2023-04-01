interface DisableLocalCardAPIKeysProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
import { MainFunctionProps, mainWrapperWithSession } from 'hyfn-server';

export const handler = async (event) => {
  const mainFunction = async ({ arg, client, userId, session }: MainFunctionProps) => {
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
  };

  return await mainWrapperWithSession({ event, mainFunction });
};
