export const getPaymentSettingsHandler = async ({ arg, client }) => {
  var result;
  const { storeId, userId } = arg[0];
  result = await client
    .db('generalData')
    .collection('storeInfo')
    .findOne(
      {
        _id: new ObjectId(storeId),
      },
      {}
    );
  return result;
};
interface GetPaymentSettingsProps extends Omit<MainFunctionProps, 'arg'> {}
('use strict');
import { mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: getPaymentSettingsHandler });
};
