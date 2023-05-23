export const getPaymentSettingsHandler = async ({ arg, client }: MainFunctionProps) => {
  var result;
  const { storeId, userId } = arg[0];
  result = await client
    .db('generalData')
    .collection('storeInfo')
    .findOne(
      {
        id: new ObjectId(storeId),
      },
      {}
    );
  return result;
};
interface GetPaymentSettingsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: getPaymentSettingsHandler });
};
