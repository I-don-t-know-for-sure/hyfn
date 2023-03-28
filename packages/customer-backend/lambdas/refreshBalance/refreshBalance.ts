import { mainWrapper } from 'hyfn-server/src';
import { MainFunctionProps } from 'hyfn-server/src';

export const handler = async (event) => {
  const mainFunction = async ({ arg, client }: MainFunctionProps) => {
    const { userId } = arg[0];

    // const balance = await findOne(
    //   { customerId: userId },
    //   { projection: { _id: 0, balance: 1 } },
    //   client.db('generalData').collection('customerInfo')
    // );
    const balance = await client
      .db('generalData')
      .collection('customerInfo')
      .findOne({ customerId: userId }, { projection: { _id: 0, balance: 1 } });
    if (!balance) {
      throw '';
    }
    return balance.balance || 0;
  };
  return await mainWrapper({ event, mainFunction });
};
