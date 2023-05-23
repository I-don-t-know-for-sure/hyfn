export const getBalanceHandler = async ({ arg, client }: MainFunctionProps) => {
  const { userId } = arg[0];
  // const balance = await findOne(
  //   { customerId: userId },
  //   { projection: {id: 0, balance: 1 } },
  //   client.db('generalData').collection('customerInfo')
  // );
  const balance = await client
    .db('generalData')
    .collection('customerInfo')
    .findOne({ customerId: userId }, { projection: { id: 0, balance: 1 } });
  if (!balance) {
    throw '';
  }
  return balance.balance || 0;
};
interface GetBalanceProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { mainWrapper } from 'hyfn-server/src';
import { MainFunctionProps } from 'hyfn-server/src';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getBalanceHandler });
};
