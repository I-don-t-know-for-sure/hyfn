import { MainFunctionProps, mainWrapper } from 'hyfn-server';

export const handler = async (event) => {
  const mainFunction = async ({ arg, client, userId }: MainFunctionProps) => {
    const result = await client
      .db('generalData')
      .collection('driverManagement')
      .findOne({ userId }, {});
    return result;
  };
  return await mainWrapper({ event, mainFunction });
};
