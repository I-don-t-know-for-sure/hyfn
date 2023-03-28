import { MainFunctionProps, mainWrapper } from 'hyfn-server';

export const handler = async (event) => {
  const mainFunction = async ({ arg, client, userId }: MainFunctionProps) => {
    await client
      .db('generalData')
      .collection('driverManagement')
      .updateOne(
        { userId },
        {
          $set: {
            localCardAPIKeyFilled: false,
          },
        },
        {}
      );
  };
  return await mainWrapper({ event, mainFunction });
};
