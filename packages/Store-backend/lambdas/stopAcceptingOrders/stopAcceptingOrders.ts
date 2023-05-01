import { MainFunctionProps, mainWrapper } from 'hyfn-server';

interface StopAcceptingOrdersProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const stopAcceptingOrders = async ({ client, userId }: StopAcceptingOrdersProps) => {
  await client
    .db('generalData')
    .collection('storeInfo')
    .updateOne({ usersIds: userId }, { $set: { acceptingOrders: false } }, {});
  return 'success';
};

export const handler = async (event: any) => {
  return await mainWrapper({ event, mainFunction: stopAcceptingOrders });
};
